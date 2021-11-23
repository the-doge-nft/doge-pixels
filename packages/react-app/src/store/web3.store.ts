import {computed, makeObservable, observable} from "mobx";
import {web3Modal} from "../services/web3Modal";
import {BigNumber, Contract, providers} from "ethers";
import {showDebugToast, showErrorToast} from "../DSL/Toast/Toast";
import {ExternalProvider, JsonRpcFetchFunc, Web3Provider} from "@ethersproject/providers/src.ts/web3-provider";
import deployedContracts from "../contracts/hardhat_contracts.json"
import testRinkebyContracts from "../contracts/test_rinkeby_hardhat_contracts.json";
import {Signer} from "@ethersproject/abstract-signer";
import {Provider} from "@ethersproject/abstract-provider";
import {isDevModeEnabled, isProduction, isStaging} from "../environment/helpers";
import {Network} from "@ethersproject/networks";
import {DOG20, PX} from "../../../hardhat/types";
import { abbreviate } from "../helpers/strings";
import KobosuJson from "../images/kobosu.json"
import AppStore from "./App.store";
import jsonify from "../helpers/jsonify";

interface EthersContractError {
    message: string
}

class Web3Store {
    D20_PRECISION = 5
    DOG_TO_PIXEL_SATOSHIS = 5523989899
    PIXEL_TO_ID_OFFSET = 1000000
    WIDTH = 640
    HEIGHT = 480

    @observable
    address?: string

    @observable
    provider?: ExternalProvider | JsonRpcFetchFunc

    @observable
    web3Provider?: Web3Provider

    @observable
    chainId?: string

    @observable
    dogBalance?: number

    @observable
    pupperBalance?: number

    @observable
    dogContract?: DOG20

    @observable
    pxContract?: PX

    @observable
    network?: Network

    // @observable
    // puppersOwned: number[] = []

    @observable
    addressToPuppers?: {[k: string]: number[]}

    constructor() {
        makeObservable(this)
        this.addressToPuppers = {}
    }

    async connect() {
        try {
            const provider = await web3Modal.connect();
            const web3Provider = new providers.Web3Provider(provider)
            const signer = web3Provider.getSigner()
            const address = await signer.getAddress()
            const network = await web3Provider.getNetwork()
            showDebugToast(`connected: ${address} on : ${network.name} (chain ID: ${network.chainId})`)

            this.network = network
            this.address = address
            this.provider = provider
            this.address = address
            this.web3Provider = web3Provider

            this.connectToContracts(signer)
            this.initPxListeners()
            this.getPupperOwnershipMap()
        } catch (e) {
            console.error("connection error: ", e)
            showErrorToast("error connecting")
        }


        if (isDevModeEnabled() && this.network?.name === "homestead") {
            throw Error("🚨 We don't test on prod here, switch to a testnet or local 🚨")
        }
    }

    async disconnect() {
        try {
            await web3Modal.clearCachedProvider()
            // if (this.web3?.disconnect && typeof this.provider.disconnect() === "function") {
            //     await this.provider.disconnect()
            // }
            showDebugToast(`disconnecting: ${this.address}`)

            this.address = undefined
            this.provider = undefined
            this.web3Provider = undefined
            this.chainId = undefined
            this.dogBalance = undefined
            // this.puppersOwned = []
        } catch (e) {
            console.error(e)
        }
    }

    async connectToContracts(signerOrProvider?: Signer | Provider) {
        if (isProduction()) {
            throw Error("Should not be production yet")
        } else if (isStaging() || this.network?.name === "rinkeby") {
            //@ts-ignore
            this.pxContract = new Contract(
              testRinkebyContracts["4"]["rinkeby"]["contracts"]["PX"]["address"],
              testRinkebyContracts["4"]["rinkeby"]["contracts"]["PX"].abi,
              signerOrProvider
            )
            //@ts-ignore
            this.dogContract = new Contract(
              testRinkebyContracts["4"]["rinkeby"]["contracts"]["DOG20"]["address"],
              testRinkebyContracts["4"]["rinkeby"]["contracts"]["DOG20"].abi,
              signerOrProvider
            )
        } else {
            //@ts-ignore
            this.pxContract = new Contract(
              deployedContracts["31337"]["localhost"]["contracts"]["PX"]["address"],
              deployedContracts["31337"]["localhost"]["contracts"]["PX"].abi,
              signerOrProvider
            )
            //@ts-ignore
            this.dogContract = new Contract(
              deployedContracts["31337"]["localhost"]["contracts"]["DOG20"]["address"],
              deployedContracts["31337"]["localhost"]["contracts"]["DOG20"].abi,
              signerOrProvider
            )
        }

        const nonContractCode = "0x"

        const pxCode = await this.web3Provider!.getCode(this.pxContract!.address)
        if (pxCode === nonContractCode) {
            throw Error("PX address is not a contract, please make sure it is deployed & you are on the correct network.")
        }

        const dogCode = await this.web3Provider!.getCode(this.dogContract!.address)
        if (dogCode === nonContractCode) {
            throw Error("DOG20 address is not a contract, please make sure it is deployed & you are on the correct network.")
        }

        this.refreshDogBalance()
        this.refreshPupperBalance()
    }

    handleAccountsChanged(accounts: string[]) {
        showDebugToast("accounts changed")
        window.location.reload()
    }

    // @TODO: could be replaced with server caching this data
    initPxListeners() {
        this.pxContract?.on("Transfer(address,address,uint256)", (from: string, to: string, tokenId: BigNumber) => {
            if (to in this.addressToPuppers! && !this.addressToPuppers![to].includes(tokenId.toNumber())) {
                this.addressToPuppers![to].push(tokenId.toNumber())
            } else {
                this.addressToPuppers![to] = [tokenId.toNumber()]
            }

            if (from in this.addressToPuppers! && this.addressToPuppers![from].includes(tokenId.toNumber())) {
                const index = this.addressToPuppers![from].indexOf(tokenId.toNumber())
                this.addressToPuppers![from].splice(index, 1)
            } else {
                this.addressToPuppers![from] = [tokenId.toNumber()]
            }
        })
    }

    async getPupperOwnershipMap() {
        this.addressToPuppers = {}
        const filter = this.pxContract!.filters.Transfer(null, null)
        const logs = await this.pxContract!.queryFilter(filter)
        logs.forEach(tx => {
            const {from, to} = tx.args
            const tokenId = tx.args.tokenId.toNumber()

            if (to in this.addressToPuppers!) {
                this.addressToPuppers![to].push(tokenId)
            } else {
                this.addressToPuppers![to] = [tokenId]
            }

            if (from in this.addressToPuppers!) {
                const index = this.addressToPuppers![from].indexOf(tokenId)
                this.addressToPuppers![from].splice(index, 1)
            } else {
                this.addressToPuppers![from] = [tokenId]
            }
        })
    }

    @computed
    get puppersOwned() {
        let myPuppers: number[] = []
        if (this.address && this.address in this.addressToPuppers!) {
            myPuppers = this.addressToPuppers![this.address]
        }
        return myPuppers
    }

    async refreshDogBalance() {
        try {
            this.dogBalance = await this.getDogBalance()
        } catch (e) {
            const {message} = e as EthersContractError
            this.dogBalance = 0
            showErrorToast(message)
        }
    }

    async refreshPupperBalance() {
        try {
            this.pupperBalance = await this.getPupperBalance()
        } catch (e) {
            const {message} = e as EthersContractError
            this.pupperBalance = 0
            showErrorToast(message)
        }
    }

    async getDogBalance() {
        const balance = await this.dogContract!.balanceOf(this.address!)
        return balance.toNumber()
    }

    async getPupperBalance() {
        const pupperBalance = await this.pxContract!.balanceOf(this.address!)
        return pupperBalance.toNumber()
    }

    async approvePxSpendDog(amount: number) {
        return this.dogContract!.approve(this.pxContract!.address, amount)
    }

    async getPxDogSpendAllowance() {
        const allowance = await this.dogContract!.allowance(this.address!, this.pxContract!.address)
        return allowance.toNumber()
    }

    async getDogToAccount() {
        return this.dogContract!.initMock([this.address!], this.DOG_TO_PIXEL_SATOSHIS * 10)
    }

    mintPuppers(pixel_amount: number) {
        return this.pxContract!.mintPuppers(pixel_amount)
    }

    pupperToPixelCoords(pupper: number) {
        return this.pxContract!.pupperToPixelCoords(pupper)
    }

    burnPupper(pupper: number) {
        return this.pxContract!.burnPupper(pupper)
    }

    @computed
    get addressForDisplay() {
        if (this.address) {
            return abbreviate(this.address)
        } else {
            return "-"
        }
    }

    pupperToIndexLocal(pupper: number) {
        return pupper - this.PIXEL_TO_ID_OFFSET
    }

    pupperToPixelCoordsLocal(pupper: number) {
        const index = this.pupperToIndexLocal(pupper)
        return [index % 640, Math.floor(index / 640)]
    }

    pupperToHexLocal(pupper: number) {
        const [x, y] = this.pupperToPixelCoordsLocal(pupper)
        //@ts-ignore
        return KobosuJson[y][x]
    }

    coordinateToPupperLocal(x: number, y: number) {
        return ((this.WIDTH * y) + x) + this.PIXEL_TO_ID_OFFSET
    }
}


export default Web3Store
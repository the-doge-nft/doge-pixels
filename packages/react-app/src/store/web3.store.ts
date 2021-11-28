import {computed, makeObservable, observable} from "mobx";
import {web3Modal} from "../services/web3Modal";
import {BigNumber, Contract, providers} from "ethers";
import {showDebugToast, showErrorToast} from "../DSL/Toast/Toast";
import {ExternalProvider, JsonRpcFetchFunc, Web3Provider} from "@ethersproject/providers/src.ts/web3-provider";
import deployedContracts from "../contracts/hardhat_contracts.json"
import {Signer} from "@ethersproject/abstract-signer";
import {Provider} from "@ethersproject/abstract-provider";
import {isDevModeEnabled, isProduction, isStaging} from "../environment/helpers";
import {Network} from "@ethersproject/networks";
import {DOG20, PX} from "../../../hardhat/types";
import { abbreviate } from "../helpers/strings";
import KobosuJson from "../images/kobosu.json"
import {Http} from "../services";

interface EthersContractError {
    message: string
}

class Web3Store {
    D20_PRECISION = BigNumber.from("1000000000000000000")
    DOG_TO_PIXEL_SATOSHIS = BigNumber.from("55239898990000000000000")
    PIXEL_TO_ID_OFFSET = 1000000
    WIDTH = 640
    HEIGHT = 480

    @observable
    address: string | null = null

    @observable
    provider: ExternalProvider | JsonRpcFetchFunc | null = null

    @observable
    web3Provider: Web3Provider | null = null

    @observable
    chainId: string | null = null

    @observable
    dogBalance: BigNumber | null = null

    @observable
    pupperBalance?: number

    @observable
    dogContract?: DOG20

    @observable
    pxContract?: PX

    @observable
    network?: Network

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
            this.errorGuardContracts()
            this.refreshDogBalance()
            this.refreshPupperBalance()
            this.getPupperOwnershipMap()
            this.getShibaDimensions()
        } catch (e) {
            this.disconnect()
            console.error("connection error: ", e)
            showErrorToast("error connecting")
        }

        if (isDevModeEnabled()) {
            if (this.network?.name === "homestead") {
                throw Error("🚨 We don't test on prod here, switch to a testnet or local 🚨")
            } else if (this.network?.name !== "rinkeby") {
                alert("Disconnecting your wallet. Please connect to Rinkeby.")
                await this.disconnect()
                window.location.reload()
            }
        }
    }

    async disconnect() {
        try {
            await web3Modal.clearCachedProvider()
            //@ts-ignore
            if (this.provider.disconnect && typeof this.provider.disconnect === "function") {
                //@ts-ignore
                await this.provider.disconnect()
            }
            showDebugToast(`disconnecting: ${this.address}`)

            this.address = null
            this.provider = null
            this.web3Provider = null
            this.chainId = null
            this.dogBalance = null
        } catch (e) {
            showErrorToast("Error disconnecting")
            console.error(e)
        }
    }

    connectToContracts(signerOrProvider?: Signer | Provider) {
        if (isProduction()) {
            throw Error("Should not be production yet")
        } else if (isStaging() || this.network?.name === "rinkeby") {
            //@ts-ignore
            this.pxContract = new Contract(
              deployedContracts["4"]["rinkeby"]["contracts"]["PX"]["address"],
              deployedContracts["4"]["rinkeby"]["contracts"]["PX"].abi,
              signerOrProvider
            )
            //@ts-ignore
            this.dogContract = new Contract(
              deployedContracts["4"]["rinkeby"]["contracts"]["DOG20"]["address"],
              deployedContracts["4"]["rinkeby"]["contracts"]["DOG20"].abi,
              signerOrProvider
            )
        }
        // else {
        //     //@ts-ignore
        //     this.pxContract = new Contract(
        //       deployedContracts["31337"]["localhost"]["contracts"]["PX"]["address"],
        //       deployedContracts["31337"]["localhost"]["contracts"]["PX"].abi,
        //       signerOrProvider
        //     )
        //     //@ts-ignore
        //     this.dogContract = new Contract(
        //       deployedContracts["31337"]["localhost"]["contracts"]["DOG20"]["address"],
        //       deployedContracts["31337"]["localhost"]["contracts"]["DOG20"].abi,
        //       signerOrProvider
        //     )
        // }
    }

    async errorGuardContracts() {
        //@TODO: possible bug here where provider needs to be disconnected before following code will pass
        const nonContractCode = "0x"
        const pxCode = await this.web3Provider!.getCode(this.pxContract!.address)
        if (pxCode === nonContractCode) {
            this.disconnect()
            throw Error(`PX address is not a contract, please make sure it is deployed & you are on the correct network. Got ${pxCode} ${this.network?.name} ${this.pxContract?.address}`)
        }
        const dogCode = await this.web3Provider!.getCode(this.dogContract!.address)
        if (dogCode === nonContractCode) {
            this.disconnect()
            throw Error("DOG20 address is not a contract, please make sure it is deployed & you are on the correct network.")
        }
    }

    getPupperOwnershipMap() {
        Http.get("/v1/config").then(({ data }) => this.addressToPuppers = data)
    }

    async getShibaDimensions() {
        Http.get("/v1/px/dimensions").then(({data}) => {
            this.WIDTH = data.width;
            this.HEIGHT = data.height;
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
            this.dogBalance = BigNumber.from(0)
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
        return balance
    }

    async getPupperBalance() {
        const res = await Http.get(`/v1/px/balance/${this.address}`)
        const balance = res.data.balance
        console.log("debug:: balance from api", balance)
        return balance

        // const pupperBalance = await this.pxContract!.balanceOf(this.address!)
        // return pupperBalance.toNumber()
    }

    async approvePxSpendDog(amount: BigNumber) {
        return this.dogContract!.approve(this.pxContract!.address, amount)
    }

    async getPxDogSpendAllowance() {
        const allowance = await this.dogContract!.allowance(this.address!, this.pxContract!.address)
        return allowance
    }

    async getDogToAccount() {
        const freePixelsInDOG = 10
        return this.dogContract!.initMock([this.address!], this.DOG_TO_PIXEL_SATOSHIS.mul(freePixelsInDOG))
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

    burnPuppers(puppers: number[]) {
        //@TODO: fix typeing of contracts on deploy
        //@ts-ignore
        return this.pxContract!.burnPuppers(puppers)
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
        return [index % this.WIDTH, Math.floor(index / this.WIDTH)]
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
import {action, computed, makeObservable, observable} from "mobx";
import {web3Modal} from "../services/web3Modal";
import {BaseContract, BigNumber, providers} from "ethers";
import {showDebugToast, showErrorToast} from "../DSL/Toast/Toast";
import {ExternalProvider, JsonRpcFetchFunc, Web3Provider} from "@ethersproject/providers/src.ts/web3-provider";
import deployedContracts from "../contracts/hardhat_contracts.json"
import {Signer} from "@ethersproject/abstract-signer";
import {Provider} from "@ethersproject/abstract-provider";
import {isDevModeEnabled} from "../environment/helpers";
import {Network} from "@ethersproject/networks";


class Web3Store {

    DOG_TO_PIXEL_SATOSHIS = 5523989899

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
    dogContract?: BaseContract

    @observable
    pxContract?: BaseContract

    @observable
    network?: Network

    constructor() {
        makeObservable(this)
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

            this.connectToContract(signer)
        } catch (e) {
            console.log("modal closed")
        }

        if (isDevModeEnabled() && this.network?.name === "homestead") {
            throw Error("We don't test on prod here, switch to a testnet or local")
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
        } catch (e) {
            console.error(e)
        }
    }

    async connectToContract(signerOrProvider?: Signer | Provider) {
        this.pxContract = new BaseContract(
            deployedContracts["31337"]["localhost"]["contracts"]["PX"]["address"],
            deployedContracts["31337"]["localhost"]["contracts"]["PX"].abi,
            signerOrProvider
        )
        this.dogContract = new BaseContract(
            deployedContracts["31337"]["localhost"]["contracts"]["DOG20"]["address"],
            deployedContracts["31337"]["localhost"]["contracts"]["DOG20"].abi,
            signerOrProvider
        )

        this.refreshDogBalance()
        this.refreshPupperBalance()
    }

    async refreshDogBalance() {
        try {
            this.dogBalance = await this.getDogBalance()
        } catch (e) {
            this.dogBalance = 0
            //@ts-ignore
            showErrorToast(e.message)
        }
    }

    async refreshPupperBalance() {
        try {
            this.pupperBalance = await this.getPupperBalance()
        } catch (e) {
            this.pupperBalance = 0
            //@ts-ignore
            showErrorToast(e.message)
        }
    }

    async approvePxSpendDog(amount: number) {
        //@ts-ignore
        return this.dogContract.approve(this.pxContract.address, amount)
    }

    async getPxDogSpendAllowance() {
        //@ts-ignore
        const allowance = await this.dogContract.allowance(this.address, this.pxContract?.address)
        return allowance.toNumber()
    }

    async getDogBalance() {
        //@ts-ignore
        const balance = await this.dogContract!.balanceOf(this.address)
        return balance.toNumber()
    }

    async getPupperBalance() {
        //@ts-ignore
        const pupperBalance = await this.pxContract.balanceOf(this.address)
        return pupperBalance.toNumber()
    }

    async getDogToAccount() {
        //@ts-ignore
        return this.dogContract.initMock([this.address], 10000000000)
    }

    mintPupper() {
        //@ts-ignore
        return this.pxContract!.mintPupper()
    }

    @computed
    get addressForDisplay() {
        if (this.address) {
            return `${this.address.substring(0,4)}...${this.address.substring(this.address.length-4, this.address.length)}`
        } else {
            return "-"
        }
    }
}


export default Web3Store
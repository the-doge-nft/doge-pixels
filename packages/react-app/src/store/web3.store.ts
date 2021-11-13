import {action, makeObservable, observable} from "mobx";
import {web3Modal} from "../services/web3Modal";
import {BaseContract, BigNumber, providers} from "ethers";
import {showDebugToast} from "../DSL/Toast/Toast";
import {ExternalProvider, JsonRpcFetchFunc, Web3Provider} from "@ethersproject/providers/src.ts/web3-provider";
import deployedContracts from "../contracts/hardhat_contracts.json"
import {Signer} from "@ethersproject/abstract-signer";
import {Provider} from "@ethersproject/abstract-provider";


class Web3Store {

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

            this.address = address
            this.provider = provider
            this.address = address
            this.web3Provider = web3Provider

            this.connectToContract(signer)

        } catch (e) {
            console.log("modal closed")
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
        const allowance = await this.getPxDogSpendAllowance()
        if (allowance <= 0) {
            await this.approvePxSpendDog(5523989899*100)
        }

        this.dogBalance = await this.getDogBalance()
        this.pupperBalance = await this.getPupperBalance()
        if (this.dogBalance == 0) {
            await this.getD20ToWallet()
        }
        this.dogBalance = await this.getDogBalance()

        console.log("dog balance: ", this.dogBalance)
        console.log("pupper balance: ", this.pupperBalance)
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

    async getD20ToWallet() {
        //@ts-ignore
        await this.dogContract.initMock([this.address], 10000000000000)
    }

    mintPupper() {
        //@ts-ignore
        return this.pxContract!.mintPupper()
        // console.log("debug:: mint res", res)
    }

    async getPupperBalance() {
        //@ts-ignore
        const pupperBalance = await this.pxContract.balanceOf(this.address)
        return pupperBalance.toNumber()
    }
}


export default Web3Store
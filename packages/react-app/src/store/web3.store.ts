import {action, makeObservable, observable} from "mobx";
import {web3Modal} from "../services/web3Modal";
import {BaseContract, providers} from "ethers";
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
        } catch (e) {
            console.error(e)
        }
    }

    connectToContract(signerOrProvider?: Signer | Provider) {
        const pxContract = new BaseContract(
            deployedContracts["31337"]["localhost"]["contracts"]["PX"]["address"],
            deployedContracts["31337"]["localhost"]["contracts"]["PX"].abi,
            signerOrProvider
        )
        const dogContract = new BaseContract(
            deployedContracts["31337"]["localhost"]["contracts"]["DOG20"]["address"],
            deployedContracts["31337"]["localhost"]["contracts"]["DOG20"].abi,
            signerOrProvider
        )
        console.log("debug:: pixel contract", pxContract)
        console.log("debug:: dog contract", dogContract)
        //@ts-ignore
        dogContract.symbol().then(res => console.log(res)).catch(e => console.error(e))
        //@ts-ignore
        pxContract.symbol().then(res => console.log(res)).catch(e => console.error(e))
        // console.log("debug:: dog contract", dogContract)

    }
}


export default Web3Store
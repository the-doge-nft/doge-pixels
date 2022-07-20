import {computed, makeObservable, observable} from "mobx";
import {ExternalProvider, Web3Provider} from "@ethersproject/providers/src.ts/web3-provider";
import {Network} from "@ethersproject/networks";
import {web3Modal} from "../services/web3Modal";
import {providers, Signer} from "ethers";
import {showDebugToast, showErrorToast} from "../DSL/Toast/Toast";
import {isDevModeEnabled, isProduction} from "../environment/helpers";
import {Http} from "../services";
import {abbreviate} from "../helpers/strings";
import AppStore from "./App.store";
import {Core} from "web3modal/dist/core";

export interface EthersContractError {
  message: string
}

export class Web3ProviderConnectionError extends Error {}

class Web3providerStore {

  @observable
  provider: Core | null = null

  @observable
  web3Provider: Web3Provider | null = null

  @observable
  chainId: string | null = null

  @observable
  network: Network | null = null

  @observable
  signer: Signer | null = null

  @observable
  address: string | null = null

  @observable
  ens: string | null = null

  constructor() {
    makeObservable(this);
  }

  async connect() {
    try {
      this.provider = await web3Modal.connect();
      this.web3Provider = new providers.Web3Provider(this.provider! as ExternalProvider)
      this.signer = this.web3Provider.getSigner()
      this.address = await this.signer.getAddress()
      this.network = await this.web3Provider.getNetwork()
      this.initListeners()
      this.getENSname(this.address!).then(({data}) => this.ens = data.ens)
      showDebugToast(`connected: ${this.address} on : ${this.network.name} (chain ID: ${this.network.chainId})`)
    } catch (e) {
      if (this.provider) {
        this.disconnect()
      }
      throw new Web3ProviderConnectionError()
    }

    await this.validateNetwork()
  }

  async validateNetwork() {
      if (this.network?.name) {
          if (isDevModeEnabled()) {
              // if (this.network.name !== "rinkeby") {
              //     showErrorToast("Please connect to Rinkeby.")
              //     await this.disconnect()
              // }

              if (this.network.name !== "homestead") {
                showErrorToast("Please connect to Mainnet.")
                await this.disconnect()
              }
          } else if (isProduction()) {
              if (this.network.name !== "homestead") {
                  showErrorToast("Please connect to Mainnet.")
                  await this.disconnect()
              }
          }
      }
  }

  async disconnect() {
    try {
      //@ts-ignore
      if (this.provider.disconnect && typeof this.provider.disconnect === "function") {
        //@ts-ignore
        await this.provider.disconnect()
      }

      //@ts-ignore
      if (this.provider.close) {
        //@ts-ignore
        await this.provider.close()
      }
      await web3Modal.clearCachedProvider()
      showDebugToast(`disconnecting: ${this.address}`)

      this.provider = null
      this.web3Provider = null
      this.chainId = null
      this.signer = null
      this.address = null
      this.network = null
    } catch (e) {
      console.error(e)
    }
  }

  getENSname(address: string) {
    return Http.get(`/v1/ens/${address}`)
  }

  @computed
  get addressForDisplay() {
    if (this.address) {
      if (this.ens) {
        return this.ens
      } else {
        return abbreviate(this.address)
      }
    } else {
      return "-"
    }
  }

  initListeners() {
    const handleAccountsChanged = (accounts: string[]) => {
      showDebugToast("accounts changed")
      window.location.reload()
    }
    const handleChainChanged = (_hexChainId: string) => {
      showDebugToast("chain changed, reloading")
      window.location.reload()
    }
    const handleDisconnect = (error: { code: number, message: string }) => {
      showDebugToast('disconnecting')
      AppStore.web3.disconnect()
    }
    AppStore.web3.provider!.on('accountsChanged', handleAccountsChanged)
    AppStore.web3.provider!.on('chainChanged', handleChainChanged)
    AppStore.web3.provider!.on('disconnect', handleDisconnect)
  }
}

export default Web3providerStore

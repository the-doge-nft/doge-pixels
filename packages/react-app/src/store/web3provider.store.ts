import { computed, makeObservable, observable } from "mobx";
// import { web3Modal } from "../services/web3Modal";
import { Signer } from "ethers";
import { showDebugToast, showErrorToast } from "../DSL/Toast/Toast";
import { abbreviate } from "../helpers/strings";
import { Http } from "../services";
// import { Core } from "web3modal/dist/core";
import { Provider } from "@wagmi/core";
import { Chain } from "wagmi";
import env from "../environment";

export interface EthersContractError {
  message: string;
}

class Web3providerStore {
  @observable
  provider: Provider | null = null;

  @observable
  network: Chain | null = null;

  @observable
  signer: Signer | null = null;

  @observable
  address: string | null = null;

  @observable
  ens: string | null = null;

  constructor() {
    makeObservable(this);
  }

  async connect(signer: Signer, network: Chain, provder: Provider) {
    try {
      this.address = await signer.getAddress()
      this.signer = signer;
      this.network = network;
      this.provider = provder
      this.getENSname(this.address!).then(({ data }) => (this.ens = data.ens));
      showDebugToast(`connected: ${this.address} on : ${this.network.name} (chain ID: ${this.network.id})`);
    } catch (e) {
      if (this.provider) {
        this.disconnect();
      }
    }
    // todo -- remove this
    await this.validateNetwork();
  }

  async validateNetwork() {
    if (this.network?.name) {
      if (this.network.id !== env.app.targetChainId) {
        await this.disconnect();
        showErrorToast(`Please connect to ${env.app.targetNetworkName.toLocaleUpperCase()}`);
      }
    }
  }

  async disconnect() {
    try {
      showDebugToast(`disconnecting: ${this.address}`);

      this.provider = null;
      this.signer = null;
      this.address = null;
      this.network = null;
    } catch (e) {
      console.error(e);
    }
  }

  getENSname(address: string) {
    return Http.get(`/v1/ens/${address}`);
  }

  @computed
  get addressForDisplay() {
    if (this.address) {
      if (this.ens) {
        return this.ens;
      } else {
        return abbreviate(this.address, 4);
      }
    } else {
      return "-";
    }
  }

  @computed
  get isConnected() {
    return !!this.signer && !!this.address;
  }
}

export default Web3providerStore;

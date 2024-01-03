import { action, computed, makeObservable, observable } from "mobx";
import { showErrorToast } from "../DSL/Toast/Toast";
import { EmptyClass } from "../helpers/mixins";
import { Http } from "../services";
import { Reactionable } from "../services/mixins/reactionable";
import AppStore from "./App.store";

export default class FreeMoneyPageStore extends Reactionable(EmptyClass) {
  @observable
  myTx: any | null = null;

  @observable
  balance: string | null = null;

  @observable
  isLoading = false;

  private messageToSign = "gib free 4200 DOG plz";

  constructor() {
    super();
    makeObservable(this);
    this.react(
      () => AppStore.web3.address,
      () => {
        if (AppStore.web3.address) {
          this.getMyTxs();
        }
      },
    );
  }

  @action
  init() {
    Http.get("/v1/freemoney/balance").then(({ data }) => {
      this.balance = data;
    });
    if (AppStore.web3.address) {
      this.getMyTxs();
    }
  }

  @action
  async getFreeMoney() {
    this.isLoading = true;
    try {
      const signature = await AppStore.web3.signMessage(this.messageToSign);
      return Http.post("/v1/freemoney", { address: AppStore.web3.address, signature })
        .then(() => {
          return this.getMyTxs();
        })
        .catch(e => {
          if (e?.message) {
            showErrorToast(e.message);
          }
        })
        .finally(() => (this.isLoading = false));
    } catch (e) {
      this.isLoading = false;
    }
  }

  @action
  getMyTxs() {
    return Http.get(`/v1/freemoney/txs/${AppStore.web3.address}`).then(({ data }) => {
      if (data.length > 0) {
        this.myTx = data?.[0];
      } else {
        this.myTx = null;
      }
    });
  }

  destroy() {
    return this.disposeReactions();
  }

  @computed
  get canGetFreeMoney() {
    return !this.myTx;
  }

  @computed
  get myTxId() {
    return this.myTx?.txId;
  }
}

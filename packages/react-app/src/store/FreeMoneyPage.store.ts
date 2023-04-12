import { makeObservable, observable } from "mobx";
import { Http } from "../services";
import AppStore from "./App.store";

export default class FreeMoneyPageStore {
  @observable
  isWaitingOnTx = false;

  @observable
  balance: string | null = null;

  constructor() {
    makeObservable(this);
  }

  init() {
    return Http.get("/v1/freemoney/balance").then(({ data }) => {
      this.balance = data;
    });
  }

  getFreeMoney() {
    return Http.post("/v1/freemoney", { address: AppStore.web3.address }).then(({ data }) => {
      console.log("data", data);
    });
  }
}

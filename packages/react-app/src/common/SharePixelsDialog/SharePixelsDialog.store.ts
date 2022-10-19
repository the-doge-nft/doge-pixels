import { action, computed, makeObservable, observable } from "mobx";
import { Navigable } from "../../services/mixins/navigable";
import { Constructor, EmptyClass } from "../../helpers/mixins";
import AppStore from "../../store/App.store";
import { showErrorToast } from "../../DSL/Toast/Toast";
import { ethers } from "ethers";
import * as Sentry from "@sentry/react";

class SharePixelsDialogStore extends EmptyClass {
  @observable
  selectedPixels: number[] = [];

  @observable
  hasUserSignedTx: boolean = false;

  @observable
  txHash: string | null = null;

  constructor() {
    super();
    makeObservable(this);
  }
}

export default SharePixelsDialogStore;

import {computed, makeObservable, observable } from "mobx";
import { showDebugToast, showErrorToast } from "../../../DSL/Toast/Toast";
import { EmptyClass } from "../../../helpers/mixins";
import { Navigable } from "../../../services/mixins/navigable";
import { Reactionable } from "../../../services/mixins/reactionable";
import AppStore from "../../../store/App.store";


export enum MintModalView {
  Mint = "mint",
  Approval = "approval",
  Loading = "loading",
  Complete = "complete"
}

class MintPixelsModalStore extends Reactionable((Navigable(EmptyClass))) {
  @observable
  pixel_count?: number;

  @observable
  dog_count: number = 0;

  @observable
  allowance?: number

  @observable
  allowanceToGrant: number = 0

  constructor() {
    super();
    makeObservable(this);
    this.pushNavigation(MintModalView.Mint);
    this.react(() => this.pixel_count, () => {
      this.dog_count = (this.pixel_count! * AppStore.web3.DOG_TO_PIXEL_SATOSHIS) / 10 ** AppStore.web3.D20_PRECISION
    })
  }

  async init() {
    try {
      const allowance = await AppStore.web3.getPxDogSpendAllowance()
      this.allowance = allowance
      console.log("debug:: allowance", allowance)
    } catch (e) {
      //@ts-ignore
      showDebugToast(e.message)
    }
  }

  @computed
  get dogCount() {
    if (this.pixel_count) {
      return Number(this.pixel_count * 55240).toString();
    } else {
      return Number(0).toString();
    }
  }

  @computed
  get stepperItems() {
    return [];
  }

  @computed
  get maxPixelsToPurchase() {
    if (AppStore.web3.dogBalance) {
      return AppStore.web3.dogBalance / AppStore.web3.DOG_TO_PIXEL_SATOSHIS
    } else return 0
  }

  async handleMintSubmit(pixel_amount: number) {
    const dogToSpend = pixel_amount * AppStore.web3.DOG_TO_PIXEL_SATOSHIS
    if (this.allowance !== undefined) {
      this.allowanceToGrant = dogToSpend - (this.allowance)
    } else {
      this.allowanceToGrant = dogToSpend
    }

    if (this.allowanceToGrant > 0) {
      this.pushNavigation(MintModalView.Approval)
    } else {
      this.mintPixels(pixel_amount)
    }
  }

  async mintPixels(amount: number) {
    try {
      const tx = await AppStore.web3.mintPuppers(amount)
      showDebugToast(`minting ${this.pixel_count!} pixel`)
      this.pushNavigation(MintModalView.Loading)
      const ret = await tx.wait()
      console.log("debug:: ret", ret)
      this.pushNavigation(MintModalView.Complete)
      AppStore.web3.refreshPupperBalance()
      AppStore.web3.refreshDogBalance()

    } catch (e) {
      showErrorToast("error minting")
    }
  }

  async handleApproveSubmit(allowance: number) {
    try {
      const tx = await AppStore.web3.approvePxSpendDog(allowance)
      showDebugToast(`approving DOG spend: ${allowance}`)
      await tx.wait()
      this.mintPixels(this.pixel_count!)
    } catch (e) {
      showErrorToast("Error approving $DOG spend")
    }
  }

  @computed
  get modalTitle() {
    switch(this.currentView) {
      case MintModalView.Mint:
        return "Mint Pixels"
      case MintModalView.Approval:
        return "Approve Pixels"
      case MintModalView.Loading:
        return "..."
      case MintModalView.Complete:
        return "complete"
      default:
        return ""
    }
  }
}

export default MintPixelsModalStore;

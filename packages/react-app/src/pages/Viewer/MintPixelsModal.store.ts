import { computed, makeObservable, observable } from "mobx";
import { Navigable } from "../../services/mixins/navigable";
import { AbstractConstructor, EmptyClass } from "../../helpers/mixins";
import AppStore from "../../store/App.store";
import {showDebugToast, showErrorToast} from "../../DSL/Toast/Toast";
import {Reactionable} from "../../services/mixins/reactionable";

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
  allowanceInput: number = 0

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


  async mintPixels(amount: number) {
    try {
      const tx = await AppStore.web3.mintPuppers(amount)
      showDebugToast(`minting ${this.pixel_count!} pixel`)
      this.pushNavigation(MintModalView.Loading)
      await tx.wait()
      this.pushNavigation(MintModalView.Complete)
      AppStore.web3.refreshPupperBalance()
      AppStore.web3.refreshDogBalance()
    } catch (e) {
      //@ts-ignore
      showErrorToast("error minting")
    }
  }

  @computed
  get maxPixelsToPurchase() {
    if (AppStore.web3.dogBalance) {
      return AppStore.web3.dogBalance / AppStore.web3.DOG_TO_PIXEL_SATOSHIS
    } else return 0
  }

  handleMintSubmit(amount: number) {
    if (this.allowance! < (this.pixel_count! * AppStore.web3.DOG_TO_PIXEL_SATOSHIS)) {
      this.pushNavigation(MintModalView.Approval)
      this.allowanceInput = this.pixel_count! * AppStore.web3.DOG_TO_PIXEL_SATOSHIS
    } else {
      this.mintPixels(amount)
    }
  }

  async handleApproveSubmit(allowance: number) {
    const tx = await AppStore.web3.approvePxSpendDog(allowance)
    showDebugToast(`approving DOG spend: ${allowance}`)
    await tx.wait()
    this.mintPixels(this.pixel_count!)
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

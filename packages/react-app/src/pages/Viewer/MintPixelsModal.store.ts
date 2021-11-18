import { computed, makeObservable, observable } from "mobx";
import { Navigable } from "../../services/mixins/navigable";
import { AbstractConstructor, EmptyClass } from "../../helpers/mixins";
import AppStore from "../../store/App.store";
import {showDebugToast, showErrorToast} from "../../DSL/Toast/Toast";

export enum MintModalView {
  Mint = "mint",
  Approval = "approval",
  Loading = "loading",
  Complete = "complete"
}

class MintPixelsModalStore extends Navigable<AbstractConstructor, MintModalView>(EmptyClass) {
  @observable
  pixel_count?: number;

  @observable
  dog_count: number = 0;

  constructor() {
    super();
    makeObservable(this);
    this.pushNavigation(MintModalView.Mint);
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
      const allowance = await AppStore.web3.getPxDogSpendAllowance()
      console.log("pixel spend allowance", allowance)

      const dogToBeSpent = this.pixel_count! * AppStore.web3.DOG_TO_PIXEL_SATOSHIS
      if (allowance < dogToBeSpent) {

        const tx = await AppStore.web3.approvePxSpendDog(dogToBeSpent)
        showDebugToast(`approving DOG spend: ${dogToBeSpent}`)
        await tx.wait()
      }
    } catch (e) {
      showErrorToast("Error committing spending allowance")
    }

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
      showErrorToast(e.message)
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

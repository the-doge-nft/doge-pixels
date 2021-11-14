import { computed, makeObservable, observable } from "mobx";
import { Navigable } from "../../services/mixins/navigable";
import { AbstractConstructor, EmptyClass } from "../../helpers/mixins";
import AppStore from "../../store/App.store";
import {showDebugToast, showErrorToast} from "../../DSL/Toast/Toast";

type MintModalView = "mint" | "approval" | "loading" | "complete";

class MintPixelsModalStore extends Navigable<AbstractConstructor, MintModalView>(EmptyClass) {
  @observable
  pixel_count?: number;

  @observable
  dog_count: number = 0;

  constructor() {
    super();
    this.pushNavigation("mint");
    makeObservable(this);
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
      const tx = await AppStore.web3.mintPupper()
      showDebugToast(`minting ${this.pixel_count!} pixel`)
      this.pushNavigation("loading")
      await tx.wait()
      this.pushNavigation("complete")
      AppStore.web3.refreshPupperBalance()
    } catch (e) {
      //@ts-ignore
      showErrorToast(e.message)
    }
  }
}

export default MintPixelsModalStore;

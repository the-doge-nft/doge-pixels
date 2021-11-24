import { Navigable } from "../../../services/mixins/navigable";
import {AbstractConstructor, EmptyClass} from "../../../helpers/mixins";
import {action, computed, makeObservable, observable } from "mobx";
import AppStore from "../../../store/App.store";
import { showErrorToast } from "../../../DSL/Toast/Toast";

export enum BurnPixelsModalView {
  Select = "select",
  LoadingBurning = "burning",
  Complete = "complete"
}

class BurnPixelsModalStore extends Navigable<AbstractConstructor, BurnPixelsModalView>(EmptyClass){

  @observable
  selectedPixels: number[] = []

  constructor(defaultPixel: number | null) {
    super();
    makeObservable(this)
    this.pushNavigation(BurnPixelsModalView.Select)
    if (defaultPixel !== null) {
      this.selectedPixels.push(defaultPixel)
    }
  }

  get stepperItems() {
    return []
  }

  handlePixelSelect(tokenId: number) {
    if (!this.selectedPixels.includes(tokenId)) {
      this.selectedPixels.push(tokenId)
    } else {
      const index = this.selectedPixels.indexOf(tokenId)
      this.selectedPixels.splice(index, 1)
    }
  }

  async burnSelectedPixels() {
      try {
        for (let i = 0; i < this.selectedPixels.length; i++) {
          const tx = await AppStore.web3.burnPupper(this.selectedPixels[i])
          await tx.wait()
          AppStore.web3.refreshDogBalance()
          AppStore.web3.refreshPupperBalance()
        }
        this.pushNavigation(BurnPixelsModalView.Complete)
      } catch (e) {
        showErrorToast("Error burning pixels")
        this.popNavigation()
      }
  }

  @action
  selectAllPixels() {
    this.selectedPixels = [...AppStore.web3.puppersOwned]
  }

  @action
  deselectAllPixels() {
    this.selectedPixels = []
  }

  @computed
  get selectedPixelsDogValue() {
    return AppStore.web3.DOG_TO_PIXEL_SATOSHIS * this.selectedPixels.length
  }

  @computed
  get isAllPixelsSelected() {
    return this.selectedPixels.length === AppStore.web3.puppersOwned.length
  }

  @computed
  get modalTitle() {
    switch (this.currentView) {
      case BurnPixelsModalView.Select:
        return "Burn your Pixels"
      default:
        return ""
    }
  }

}

export default BurnPixelsModalStore

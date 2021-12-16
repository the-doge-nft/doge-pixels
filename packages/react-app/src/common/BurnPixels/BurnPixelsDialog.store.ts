import {action, computed, makeObservable, observable} from "mobx";
import {Navigable} from "../../services/mixins/navigable";
import {AbstractConstructor, EmptyClass} from "../../helpers/mixins";
import AppStore from "../../store/App.store";
import {showErrorToast} from "../../DSL/Toast/Toast";
import {ethers} from "ethers";

export enum BurnPixelsModalView {
  Select = "select",
  LoadingBurning = "burning",
  Complete = "complete"
}

class BurnPixelsDialogStore extends Navigable<AbstractConstructor, BurnPixelsModalView>(EmptyClass){

  @observable
  selectedPixels: number[] = []

  @observable
  hasUserSignedTx: boolean = false

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
    this.hasUserSignedTx = false
    let tx
    try {
      if (this.selectedPixels.length === 1) {
        tx = await AppStore.web3.burnPupper(this.selectedPixels[0])
      } else if (this.selectedPixels.length > 1) {
        tx = await AppStore.web3.burnPuppers(this.selectedPixels)
      } else {
        throw Error("burnSelectedPixels called with incorrect selectedPixels length")
      }
      this.hasUserSignedTx = true
      await tx.wait()
      this.pushNavigation(BurnPixelsModalView.Complete)
      AppStore.web3.refreshDogBalance()
      AppStore.web3.refreshPupperBalance()
      AppStore.web3.refreshPupperOwnershipMap()
    } catch (e) {
      console.error(e)
      showErrorToast("Error burning pixels")
      this.hasUserSignedTx = false
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
    return ethers.utils.formatEther(AppStore.web3.DOG_TO_PIXEL_SATOSHIS.mul(this.selectedPixels.length))
  }

  @computed
  get isAllPixelsSelected() {
    return this.selectedPixels.length === AppStore.web3.puppersOwned.length
  }

  @computed
  get isUserPixelOwner() {
    return AppStore.web3.puppersOwned.length > 0
  }

  @computed
  get modalTitle() {
    switch (this.currentView) {
      case BurnPixelsModalView.Select:
        return "Burn Pixels"
      default:
        return ""
    }
  }

  @computed
  get description() {
    switch (this.currentView) {
      case BurnPixelsModalView.Select:
        if (this.isUserPixelOwner) {
          return "Be sure to be careful with which pixels you select. You’ll most likely never see them again."
        } else {
          return "No pixels found - try minting first!"
        }
      default:
        return ""
    }
  }

}

export default BurnPixelsDialogStore


import {action, computed, makeObservable, observable} from "mobx";
import {Navigable} from "../../services/mixins/navigable";
import {Constructor, EmptyClass} from "../../helpers/mixins";
import AppStore from "../../store/App.store";
import {showErrorToast} from "../../DSL/Toast/Toast";
import {ethers} from "ethers";
import * as Sentry from "@sentry/react";

export enum PixelGeneratorModalView {
  Select = "select",
  LoadingGenerate = "generating",
  Complete = "complete"
}

class PixelGeneratorDialogStore extends Navigable<PixelGeneratorModalView, Constructor>(EmptyClass){

  @observable
  selectedColor: string = ''

  @observable
  hasUserSignedTx: boolean = false

  @observable
  txHash: string | null = null

  constructor() {
    super();
    makeObservable(this)
    this.pushNavigation(PixelGeneratorModalView.Select)
    if (AppStore.web3.puppersOwned.length > 0 ) {
      this.selectedColor = AppStore.web3.pupperToHexLocal(AppStore.web3.puppersOwned[0])
    }
  }

  get stepperItems() {
    return []
  }

  handlePixelSelect(color: string) {
    this.selectedColor = color
  }

  // @computed
  // get selectedColorDogValue() {
  //   const dogReturnedWithoutFees = Number(ethers.utils.formatEther(AppStore.web3.DOG_TO_PIXEL_SATOSHIS.mul(this.selectedColor.length)))
  //   const dogFees = dogReturnedWithoutFees * (AppStore.web3.DOG_BURN_FEES_PERCENT / 100)
  //   return (dogReturnedWithoutFees - dogFees).toFixed(4)
  // }

  // @computed
  // get isAllPixelsSelected() {
  //   return this.selectedColor.length === AppStore.web3.puppersOwned.length
  // }

  @computed
  get isUserPixelOwner() {
    return AppStore.web3.puppersOwned.length > 0
  }
}

export default PixelGeneratorDialogStore


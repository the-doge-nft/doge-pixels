import * as Sentry from "@sentry/react";
import { ethers } from "ethers";
import { action, computed, makeObservable, observable, toJS } from "mobx";
import { showDebugToast, showErrorToast } from "../../DSL/Toast/Toast";
import { Constructor, EmptyClass } from "../../helpers/mixins";
import { Navigable } from "../../services/mixins/navigable";
import AppStore from "../../store/App.store";

export enum BurnPixelsModalView {
  Select = "select",
  LoadingBurning = "burning",
  Complete = "complete",
}

class BurnPixelsDialogStore extends Navigable<BurnPixelsModalView, Constructor>(EmptyClass) {
  @observable
  selectedPixels: number[] = [];

  @observable
  hasUserSignedTx: boolean = false;

  @observable
  txHash: string | null = null;

  @observable
  oldPixels: number[] = [];

  @observable
  diffPixels: number[] = [];

  constructor(defaultPixel: number | null) {
    super();
    makeObservable(this);
    this.pushNavigation(BurnPixelsModalView.Select);
    if (defaultPixel !== null) {
      this.selectedPixels.push(defaultPixel);
    }
  }

  get stepperItems() {
    return [];
  }

  handlePixelSelect(tokenId: number) {
    if (!this.selectedPixels.includes(tokenId)) {
      this.selectedPixels.push(tokenId);
    } else {
      const index = this.selectedPixels.indexOf(tokenId);
      this.selectedPixels.splice(index, 1);
    }
  }

  async burnSelectedPixels() {
    this.hasUserSignedTx = false;
    let tx;
    try {
      if (this.selectedPixels.length === 1) {
        tx = await AppStore.web3.burnPupper(this.selectedPixels[0]);
      } else if (this.selectedPixels.length > 1) {
        tx = await AppStore.web3.burnPuppers(this.selectedPixels);
      } else {
        throw Error("burnSelectedPixels called with incorrect selectedPixels length");
      }
      this.hasUserSignedTx = true;
      this.oldPixels = toJS(AppStore.web3.puppersOwned);
      showDebugToast(`burning pixels`);
      const receipt = await tx.wait();
      this.txHash = receipt;

      await AppStore.web3.refreshPixelOwnershipMap();
      const newPixels = toJS(AppStore.web3.puppersOwned);
      const mintedPixels = newPixels.filter(pixel => {
        if (!this.oldPixels.includes(pixel)) {
          return 1;
        }
        return 0;
      });
      const burnedPixels = this.oldPixels.filter(pixel => {
        if (!newPixels.includes(pixel)) {
          return 1;
        }
        return 0;
      });
      this.diffPixels = mintedPixels.concat(burnedPixels);
      this.pushNavigation(BurnPixelsModalView.Complete);
    } catch (e) {
      Sentry.captureException(e);
      console.error(e);
      showErrorToast("Error burning pixels");
      this.hasUserSignedTx = false;
      this.popNavigation();
    }
  }

  @action
  selectAllPixels() {
    this.selectedPixels = [...AppStore.web3.puppersOwned];
  }

  @action
  deselectAllPixels() {
    this.selectedPixels = [];
  }

  @computed
  get selectedPixelsDogValue() {
    const dogReturnedWithoutFees = Number(
      ethers.utils.formatEther(AppStore.web3.DOG_TO_PIXEL_SATOSHIS.mul(this.selectedPixels.length)),
    );
    const dogFees = dogReturnedWithoutFees * (AppStore.web3.DOG_BURN_FEES_PERCENT / 100);
    return (dogReturnedWithoutFees - dogFees).toFixed(4);
  }

  @computed
  get isAllPixelsSelected() {
    return this.selectedPixels.length === AppStore.web3.puppersOwned.length;
  }

  @computed
  get isUserPixelOwner() {
    return AppStore.web3.puppersOwned.length > 0;
  }

  @computed
  get modalTitle() {
    switch (this.currentView) {
      case BurnPixelsModalView.Select:
        return "Burn Pixels";
      default:
        return "";
    }
  }

  @computed
  get description() {
    switch (this.currentView) {
      case BurnPixelsModalView.Select:
        if (this.isUserPixelOwner) {
          return (
            "Be sure to be careful with which pixels you select. You’ll most likely never see them again. A 1% fee in DOG" +
            " is taken upon burning your pixels."
          );
        } else {
          return "No pixels found - try minting first!";
        }
      default:
        return "";
    }
  }
}

export default BurnPixelsDialogStore;

import { Contract } from "ethers";
import { computed, makeObservable, observable, toJS } from "mobx";
import { Navigable } from "../../services/mixins/navigable";
import AppStore from "../../store/App.store";
import { showDebugToast } from "./../../DSL/Toast/Toast";
import { Constructor, EmptyClass } from "./../../helpers/mixins";
import { getProof } from "./../../services/merkletree";
import { StepperItems } from "./../../services/mixins/navigable";

const whitelist = require("../../services/whitelists/rainbowClaim.json");

export enum RainbowClaimDialogView {
  Claim = "claim",
  Loading = "loading",
  Complete = "complete",
}

class RainbowClaimDialogStore extends Navigable<RainbowClaimDialogView, Constructor>(EmptyClass) {
  @observable
  txHash: string | null = null;

  @observable
  oldPixels: number[] = [];

  @observable
  diffPixels: number[] = [];

  @observable
  hasUserSignedTx: boolean = false;

  constructor(private readonly rainbowContract: Contract) {
    super();
    makeObservable(this);
    this.pushNavigation(RainbowClaimDialogView.Claim);
  }

  get stepperItems(): StepperItems<RainbowClaimDialogView>[] {
    return [];
  }

  @computed
  get title() {
    switch (this.currentView) {
      case RainbowClaimDialogView.Claim:
        return "Claim";
      default:
        return "";
    }
  }

  @computed
  get description() {
    switch (this.currentView) {
      case RainbowClaimDialogView.Claim:
        return "Claim a pixel of The Doge NFT";
      default:
        return "";
    }
  }

  async claimPixel() {
    try {
      this.hasUserSignedTx = false;
      this.oldPixels = toJS(AppStore.web3.puppersOwned);
      showDebugToast("Claiming pixel from rainbow contract");
      this.pushNavigation(RainbowClaimDialogView.Loading);
      const proof = getProof(AppStore.web3.address, whitelist);
      const estimatedGas = await this.rainbowContract.estimateGas.claim(proof);
      const gasLimitSafetyOffset = 80000;
      if (!estimatedGas) {
        console.error("Could not estimate gas");
      }
      const tx = await this.rainbowContract.claim(proof, { gasLimit: estimatedGas.add(gasLimitSafetyOffset) });
      this.hasUserSignedTx = true;

      const receipt = await tx.wait();
      this.txHash = receipt.transactionHash;

      await AppStore.web3.refreshPixelOwnershipMap();
      const newPixels = toJS(AppStore.web3.puppersOwned);
      const claimedPixels = newPixels.filter(pixel => {
        if (!this.oldPixels.includes(pixel)) {
          return 1;
        }
        return 0;
      });
      this.diffPixels = claimedPixels;
      this.pushNavigation(RainbowClaimDialogView.Complete);
    } catch (e) {
      console.error(e);
      this.popNavigation();
      this.hasUserSignedTx = false;
    }
  }
}

export default RainbowClaimDialogStore;

import {computed, makeObservable, observable } from "mobx";
import { Navigable } from "../../services/mixins/navigable";
import { Reactionable } from "../../services/mixins/reactionable";
import {EmptyClass} from "../../helpers/mixins";
import { BigNumber, ethers } from "ethers";
import AppStore from "../../store/App.store";
import {showDebugToast, showErrorToast} from "../../DSL/Toast/Toast";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";


export enum MintModalView {
  Mint = "mint",
  Approval = "approval",
  LoadingApproval = "loadingApproval",
  LoadingPixels = "loadingPixels",
  Complete = "complete"
}

class MintPixelsDialogStore extends Reactionable((Navigable(EmptyClass))) {
  @observable
  pixel_count: number | string = 1;

  @observable
  allowance?: BigNumber

  @observable
  allowanceToGrant: BigNumber = BigNumber.from(0)

  @observable
  hasUserSignedTx = false

  @observable
  approveInfinite = false

  @observable
  txHash: string | null = null

  constructor() {
    super();
    makeObservable(this);
  }

  init() {
    this.pushNavigation(MintModalView.Mint);
    this.refreshAllowance()
  }

  async refreshAllowance() {
    try {
      this.allowance = await AppStore.web3.getPxDogSpendAllowance()
    } catch (e) {
      showErrorToast("Could not get allowance")
    }
  }

  @computed
  get stepperItems() {
    return [];
  }

  @computed
  get maxPixelsToPurchase() {
    if (AppStore.web3.dogBalance) {
      // num & denom in ether
      return AppStore.web3.dogBalance.div(AppStore.web3.DOG_TO_PIXEL_SATOSHIS).toNumber()
    } else return 0
  }

  handleMintSubmit(pixel_amount: number) {
    const dogToSpend = AppStore.web3.DOG_TO_PIXEL_SATOSHIS.mul(pixel_amount)
    if (this.allowance!.lt(dogToSpend)) {
      this.allowanceToGrant = dogToSpend
      this.pushNavigation(MintModalView.Approval)
    } else {
      this.pushNavigation(MintModalView.LoadingPixels)
    }
  }

  async mintPixels(amount: number) {
    this.hasUserSignedTx = false
    try {
      const estimatedGas = await AppStore.web3.pxContract?.estimateGas.mintPuppers(amount)
      if (!estimatedGas) {
        throw Error("Could not estimate gas")
      }

      const gasLimitSafetyOffset = 100000
      const tx = await AppStore.web3.mintPuppers(amount, estimatedGas.add(gasLimitSafetyOffset))

      this.hasUserSignedTx = true
      showDebugToast(`minting ${this.pixel_count!} pixel`)
      const receipt = await tx.wait()
      this.txHash = receipt.transactionHash
      this.pushNavigation(MintModalView.Complete)
      AppStore.web3.refreshPupperBalance()
      AppStore.web3.refreshDogBalance()
      AppStore.web3.refreshPupperOwnershipMap()

    } catch (e) {
      showErrorToast("error minting")
      console.error(e)
      this.hasUserSignedTx = false
      this.destroyNavigation()
      this.pushNavigation(MintModalView.Mint)
    }
  }


  async approveDogSpend() {
    this.hasUserSignedTx = false
    try {
      if (this.approveInfinite) {
        this.allowanceToGrant = ethers.constants.MaxUint256
      }
      const tx = await AppStore.web3.approvePxSpendDog(this.allowanceToGrant)
      this.hasUserSignedTx = true
      showDebugToast(`approving DOG spend: ${formatWithThousandsSeparators(ethers.utils.formatEther(this.allowanceToGrant))}`)
      await tx.wait()
      this.refreshAllowance()
      this.pushNavigation(MintModalView.LoadingPixels)
    } catch (e) {
      this.hasUserSignedTx = false
      this.popNavigation()
      showErrorToast("Error approving $DOG spend")
    }
  }

  @computed
  get title() {
    switch(this.currentView) {
      case MintModalView.Mint:
        return "Mint Pixels"
      case MintModalView.Approval:
        return "Approve $DOG"
      default:
        return ""
    }
  }

  @computed
  get dogCount() {
    if (this.pixel_count) {
      //@CC: TODO protect agaist edge cases here "0.1" "-" etc
      if (this.pixel_count === "-" || this.pixel_count === ".") {
        return 0
      }
      return ethers.utils.formatEther(AppStore.web3.DOG_TO_PIXEL_SATOSHIS.mul(this.pixel_count))
    } else {
      return 0
    }
  }

  @computed
  get description() {
    switch (this.currentView) {
      case MintModalView.Mint:
        return "Trade $DOG for pixels. Each pixel is worth 55,240 $DOG."
      default:
        return undefined
    }
  }
}

export default MintPixelsDialogStore;

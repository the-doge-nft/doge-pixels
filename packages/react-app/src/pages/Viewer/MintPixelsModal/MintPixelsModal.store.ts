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
  pixel_count?: number = 1;

  @observable
  allowance?: number

  @observable
  allowanceToGrant: number = 0

  @observable
  newlyMintedPupperIds: number[] = []

  constructor() {
    super();
    makeObservable(this);
  }

  async init() {
    this.pushNavigation(MintModalView.Mint);
    this.refreshAllowance()
  }

  async refreshAllowance() {
    try {
      this.allowance = await AppStore.web3.getPxDogSpendAllowance()
      console.log("debug:: allowance", this.allowance)
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
      return AppStore.web3.dogBalance / AppStore.web3.DOG_TO_PIXEL_SATOSHIS
    } else return 0
  }

  handleMintSubmit(pixel_amount: number) {
    return new Promise((resolve, reject) => {
      const dogToSpend = pixel_amount * AppStore.web3.DOG_TO_PIXEL_SATOSHIS
      if (this.allowance! < dogToSpend) {
        this.allowanceToGrant = dogToSpend
        resolve(this.pushNavigation(MintModalView.Approval))
      } else {
        resolve(this.pushNavigation(MintModalView.Loading))
      }
    })
  }

  async mintPixels(amount: number) {
    try {
      const tx = await AppStore.web3.mintPuppers(amount)
      showDebugToast(`minting ${this.pixel_count!} pixel`)
      const receipt = await tx.wait()
      receipt.events?.forEach(event => {
        const tokenId = event.args?.tokenId.toNumber()
        if (tokenId) {
          if (!this.newlyMintedPupperIds.includes(tokenId)) {
            this.newlyMintedPupperIds.push(tokenId)
          }
        }
      })
      this.pushNavigation(MintModalView.Complete)
      AppStore.web3.refreshPupperBalance()
      AppStore.web3.refreshDogBalance()
    } catch (e) {
      this.destroyNavigation()
      this.pushNavigation(MintModalView.Mint)
    }
  }


  async handleApproveSubmit() {
    try {
      const tx = await AppStore.web3.approvePxSpendDog(this.allowanceToGrant)
      showDebugToast(`approving DOG spend: ${this.allowanceToGrant}`)
      await tx.wait()
      this.refreshAllowance()
      this.pushNavigation(MintModalView.Loading)
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
        return "Approve $DOG"
      default:
        return ""
    }
  }

  @computed
  get dogCount() {
    if (this.pixel_count) {
      return (this.pixel_count! * AppStore.web3.DOG_TO_PIXEL_SATOSHIS) / 10 ** AppStore.web3.D20_PRECISION
    } else {
      return 0
    }
  }
}

export default MintPixelsModalStore;

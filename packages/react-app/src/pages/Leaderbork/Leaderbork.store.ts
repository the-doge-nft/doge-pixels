import {computed, makeObservable, observable} from "mobx";
import AppStore from "../../store/App.store";
import {Reactionable} from "../../services/mixins/reactionable";
import {EmptyClass} from "../../helpers/mixins";
import {ethers} from "ethers";
import {abbreviate} from "../../helpers/strings";
import {Http} from "../../services";
import {generatePath} from "react-router-dom";

export interface PixelOwnerInfo {
  address: string;
  pixels: number[];
  ens: string | null
}

interface PixelTransfer {
  id: number;
  from: {
    address: string;
    ens: string | null
  };
  insertedAt: string;
  to: {
    address: string;
    ens: string | null;
  };
  tokenId: number;
  uniqueTransferId: string;
  updatedAt: string;
  blockNumber: number;
  blockCreatedAt: string;
}

export enum SelectedOwnerTab {
  Wallet = "wallet",
  Transfers = "transfers"
}

class LeaderborkStore extends Reactionable(EmptyClass) {

  @observable
  searchValue = ""

  @observable
  selectedAddress?: string

  @observable
  selectedPixelId: number | null = null

  @observable
  selectedTransferId: string | null = null

  @observable
  lockedDog: number | null = null

  @observable
  globalTransfers: PixelTransfer[] = []

  @observable
  selectedOwnerTransfers: PixelTransfer[] = []

  @observable
  selectedOwnerTab: SelectedOwnerTab = SelectedOwnerTab.Transfers

  constructor(selectedAddress?: string, selectedPixelId?: number, transferId?: string, selectedOwnerTab?: SelectedOwnerTab) {
    super()
    makeObservable(this)

    if (selectedAddress) {
      this.searchValue = selectedAddress
      this.selectedAddress = selectedAddress
    }

    if (selectedPixelId) {
      this.selectedPixelId = selectedPixelId
    }

    if (transferId) {
      this.selectedTransferId = transferId
    }

    if (selectedOwnerTab) {
      this.selectedOwnerTab = selectedOwnerTab
    }

    console.log('debug::', selectedAddress, selectedPixelId, transferId, selectedOwnerTab)

    this.react(() => this.searchValue, (value, prevValue) => {
      //@ts-ignore
      if ((this.selectedAddress && value.length === prevValue.length - 1) || value === "") {
        this.selectedAddress = undefined
        this.searchValue = ""
      }

      if (this.searchValue === "") {
        this.getGlobalTransfers()
      }
    })
  }

  init() {
    AppStore.web3.getDogLocked().then(balance => {
      this.lockedDog = Number(balance)
    })
    AppStore.web3.getPixelOwnershipMap()
    if (this.selectedAddress) {
      this.getSelectedUserTransfers()
    } else {
      this.getGlobalTransfers().then((_) => {
        this.selectedTransferId = this.globalTransfers[0].uniqueTransferId
      })
    }
  }

  @computed
  get ownersTypeaheadItems() {
    return AppStore.web3.sortedPixelOwners.map(item => ({value: item.address, name: item.ens ? item.ens : item.address}))
  }

  @computed
  get selectedOwner(): PixelOwnerInfo | undefined {
    return AppStore.web3.sortedPixelOwners.filter(dog => dog.address === this.selectedAddress)[0]
  }

  @computed
  get selectedAddressDisplayName() {
    if (this.selectedAddress) {
      if (this.selectedOwner?.ens) {
        return this.selectedOwner.ens
      } else {
        return abbreviate(this.selectedAddress)
      }
    }
    return "None"
  }

  @computed
  get selectedActivityTokenId() {
    return this.selectedActivityTransfer?.tokenId
  }

  @computed
  get selectedActivityTransferDetails() {
    let title
    let description
    if (this.selectedActivityTransfer.from.address === ethers.constants.AddressZero) {
      title = "Minted"
      description = abbreviate(this.selectedActivityTransfer.to.address, 4)
    } else if (this.selectedActivityTransfer.to.address === ethers.constants.AddressZero) {
      title = "Burned"
      description = abbreviate(this.selectedActivityTransfer.from.address, 4)
    } else {
      title = "Transfer"
      description = `${abbreviate(this.selectedActivityTransfer.from.address, 4)} to ${abbreviate(this.selectedActivityTransfer.to.address, 4)}`
    }
    return {title, description}
  }

  async setSelectedAddress(address: string) {
    this.selectedAddress = address;
    this.searchValue = this.selectedAddress
    this.selectedOwnerTab = SelectedOwnerTab.Wallet
    this.selectedPixelId = this.selectedOwner.pixels[0]
    this.pushWindowState(generatePath(`/leaderbork/:address/${SelectedOwnerTab.Wallet}/:tokenId`,
        {address: this.selectedAddress, tokenId: this.selectedPixelId}))
    this.getSelectedUserTransfers()
  }

  setSelectedPixelId(pixelId: number | null) {
    this.selectedPixelId = pixelId
    this.pushWindowState(generatePath(`/leaderbork/:address/${SelectedOwnerTab.Wallet}/:tokenId`,
        {address: this.selectedAddress, tokenId: this.selectedPixelId}))
  }

  setActivityId(activityId: string) {
    this.selectedTransferId = activityId;
    if (this.selectedOwner) {
      this.pushWindowState(generatePath(`/leaderbork/:address/${SelectedOwnerTab.Transfers}/:activityId`,
          {address: this.selectedAddress, activityId: this.selectedTransferId}))
    } else {
      this.pushWindowState(generatePath(`/leaderbork/${SelectedOwnerTab.Transfers}/:activityId`, {activityId: this.selectedTransferId}))
    }
  }

  pushWindowState(route: string) {
    // helper to push window state without causing a rerender
    return window.history.pushState({}, "", route)
  }

  destroy() {
    return this.disposeReactions()
  }

  @computed
  get transfers() {
    if (this.selectedOwner) {
      return this.selectedOwnerTransfers
    } else {
      return this.globalTransfers
    }
  }

  @computed
  get selectedActivityTransfer(): PixelTransfer | undefined {
    if (this.selectedOwner) {
      return this.selectedOwnerTransfers.filter(transfer => transfer.uniqueTransferId === this.selectedTransferId)[0]
    } else {
      return this.globalTransfers.filter(transfer => transfer.uniqueTransferId === this.selectedTransferId)[0]
    }
  }

  getGlobalTransfers() {
    return Http.post<PixelTransfer[]>("/v1/transfers", {
      sort: {
        blockNumber: "desc"
      }
    }).then(({data}) => {
      this.globalTransfers = data
    })
  }

  getSelectedUserTransfers() {
    return Http.post(`/v1/transfers/${this.selectedAddress}`, {
      sort: {
        blockNumber: "desc"
      }
    }).then(({data}) => {
      this.selectedOwnerTransfers = data
    })
  }

  @computed
  get activityPaneTitle() {
    if (!this.selectedAddress) {
      return "Recent Activity"
    } else {
      if (this.selectedOwner) {
        return this.selectedOwner.ens ? this.selectedOwner.ens : abbreviate(this.selectedOwner.address, 4)
      }
      return ""
    }
  }

  setSelectedOwnerTab(tabType: SelectedOwnerTab) {
    this.selectedOwnerTab = tabType
    if (this.selectedOwnerTab === SelectedOwnerTab.Wallet) {
      this.selectedPixelId = this.selectedOwner.pixels[0]
      this.pushWindowState(generatePath(`/leaderbork/:address/${SelectedOwnerTab.Wallet}/:tokenId`, {address: this.selectedAddress, tokenId: this.selectedPixelId}))
    } else if (this.selectedOwnerTab === SelectedOwnerTab.Transfers) {
      this.selectedTransferId = this.selectedOwnerTransfers[0].uniqueTransferId
      this.pushWindowState(generatePath(`/leaderbork/:address/${SelectedOwnerTab.Transfers}/:activityId`, {address: this.selectedAddress, activityId: this.selectedTransferId}))
    }
  }

  @computed
  get previewPixels() {
    if (this.selectedOwner) {
      return this.selectedOwner.pixels
    } else {
      return [this.selectedActivityTokenId]
    }
  }

  @computed
  get previewSelectedPixel() {
    if (this.selectedOwner) {
      if (this.selectedOwnerTab === SelectedOwnerTab.Transfers) {
        return this.selectedActivityTokenId
      } else {
        return this.selectedPixelId
      }
    } else {
      return this.selectedActivityTokenId
    }
  }
}

export default LeaderborkStore

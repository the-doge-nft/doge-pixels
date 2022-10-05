import {computed, makeObservable, observable} from "mobx";
import AppStore from "../../store/App.store";
import {Reactionable} from "../../services/mixins/reactionable";
import {EmptyClass} from "../../helpers/mixins";
import {ethers} from "ethers";
import {abbreviate} from "../../helpers/strings";
import {Http} from "../../services";
import {NamedRoutes, route} from "../../App.routes";
import {generatePath} from "react-router-dom";

export interface PixelOwnerInfo {
  address: string;
  pixels: number[];
  ens: string | null
}

interface PixelTransfer {
  id: number;
  from: string;
  insertedAt: string;
  to: string;
  tokenId: number;
  uniqueTransferId: string;
  updatedAt: string;
  blockNumber: number;
  blockCreatedAt: string;
}

export enum SelectedOwnerTab {
  Transfers = "Transfers",
  Wallet = "Wallet"
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

  constructor(selectedAddress?: string, selectedPixelId?: number, transferId?: string) {
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

    this.react(() => this.searchValue, (value, prevValue) => {
      //@ts-ignore
      if ((this.selectedAddress && value.length === prevValue.length - 1) || value === "") {
        this.selectedAddress = undefined
        this.searchValue = ""
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
  get selectedUserHasPixels() {
    return this.selectedOwner !== undefined && this.selectedOwner.pixels.length > 0
  }

  @computed
  get isSearchEmpty() {
    return this.searchValue === ""
  }

  @computed
  get selectedPixelCoordinates() {
    if (this.selectedPixelId) {
      return AppStore.web3.pupperToPixelCoordsLocal(this.selectedPixelId)
    }
    return []
  }

  @computed
  get selectedPixelHexColor() {
    return AppStore.web3.pupperToHexLocal(this.selectedPixelId!)
  }

  @computed
  get seletedPixelIndex() {
    return AppStore.web3.pupperToIndexLocal(this.selectedPixelId!)
  }

  @computed
  get isSelectedAddressAuthedUser() {
    return this.selectedAddress === AppStore.web3.address
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
    if (this.selectedActivityTransfer.from === ethers.constants.AddressZero) {
      title = "Minted"
      description = abbreviate(this.selectedActivityTransfer.to, 4)
    } else if (this.selectedActivityTransfer.to === ethers.constants.AddressZero) {
      title = "Burned"
      description = abbreviate(this.selectedActivityTransfer.from, 4)
    } else {
      title = "Transfer"
      description = `${abbreviate(this.selectedActivityTransfer.from, 4)} to ${abbreviate(this.selectedActivityTransfer.to, 4)}`
    }
    return {title, description}
  }

  async selectOwner(address: string) {
    this.selectedAddress = address;
    this.searchValue = this.selectedAddress
    await this.getSelectedUserTransfers()
    this.selectedTransferId = this.selectedOwnerTransfers[0].uniqueTransferId
    this.pushWindowState(generatePath("/leaderbork/:address/activity/:activityId", {address: this.selectedAddress, activityId: this.selectedTransferId}))
  }

  setSelectedPixelId(pixelId: number | null) {
    this.selectedPixelId = pixelId
    this.pushWindowState(generatePath("/leaderbork/:address/:tokenId", {address: this.selectedAddress, tokenId: this.selectedPixelId}))
  }

  setActivityId(activityId: string) {
    this.selectedTransferId = activityId;
    if (this.selectedOwner) {
      this.pushWindowState(generatePath("/leaderbork/:address/activity/:activityId", {address: this.selectedAddress, activityId: this.selectedTransferId}))
    } else {
      this.pushWindowState(generatePath("/leaderbork/activity/:activityId", {activityId: this.selectedTransferId}))
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
}

export default LeaderborkStore

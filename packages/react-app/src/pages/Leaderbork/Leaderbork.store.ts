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
  transfers: PixelTransfer[] = []

  constructor(selectedAddress?: string, selectedPixelId?: number, transferId?: string) {
    super()
    makeObservable(this)

    console.log(selectedAddress, selectedPixelId)

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

    Http.post<PixelTransfer[]>("/v1/transfers", {
      sort: {
        blockNumber: "desc"
      }
    }).then(({data}) => {
      this.transfers = data
      if (this.selectedTransferId) {
        // TODO: there could be a case where this transfer ID does not exist in the current history
        // either expand for *all* transfers, or we need to keep paging until we hit the data point
        this.setActivityId(this.selectedTransferId)
      } else if (!this.selectedPixelId && !this.selectedAddress) {
        this.setActivityId(this.transfers[0]?.uniqueTransferId)
      }
    })
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
  get selectedActivityTransfer(): PixelTransfer | undefined {
    return this.transfers.filter(transfer => transfer.uniqueTransferId === this.selectedTransferId)[0]
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

  selectOwner(address: string) {
    this.selectedAddress = address;
    this.searchValue = this.selectedAddress
    this.setSelectedPixelId(this.selectedOwner.pixels[0])
  }

  setSelectedPixelId(pixelId: number | null) {
    this.selectedPixelId = pixelId
    this.pushWindowState(generatePath("/leaderbork/:address/:tokenId", {address: this.selectedAddress, tokenId: this.selectedPixelId}))
  }

  setActivityId(activityId: string) {
    this.selectedTransferId = activityId;
    this.pushWindowState(generatePath("/leaderbork/:activityId", {activityId: this.selectedTransferId}))
  }

  pushWindowState(route: string) {
    // helper to push window state without causing a rerender
    return window.history.pushState({}, "", route)
  }

  destroy() {
    return this.disposeReactions()
  }
}

export default LeaderborkStore

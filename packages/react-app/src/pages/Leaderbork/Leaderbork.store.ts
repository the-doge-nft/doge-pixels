import {computed, makeObservable, observable} from "mobx";
import { ObjectKeys } from "../../helpers/objects";
import AppStore from "../../store/App.store";
import {arrayFuzzyFilterByKey} from "../../helpers/arrays";
import { Reactionable } from "../../services/mixins/reactionable";
import { EmptyClass } from "../../helpers/mixins";
import {ethers} from "ethers";
import {abbreviate} from "../../helpers/strings";
import {Http} from "../../services";

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
  selectedPixel: number | null = null

  @observable
  selectedTransferId: string | null = null

  @observable
  lockedDog: number | null = null

  @observable
  transfers: PixelTransfer[] = []

  constructor(selectedAddress?: string, selectedPupper?: number) {
    super()
    makeObservable(this)

    if (selectedAddress) {
      this.searchValue = selectedAddress
      this.selectedAddress = selectedAddress
    }

    if (selectedPupper) {
      this.selectedPixel = selectedPupper
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
      this.selectedTransferId = this.transfers[0]?.uniqueTransferId
    })
  }

  @computed
  get filteredOwners() {
    return arrayFuzzyFilterByKey(AppStore.web3.sortedPixelOwners, this.searchValue, 'address')
        .concat(arrayFuzzyFilterByKey(AppStore.web3.sortedPixelOwners, this.searchValue, 'ens'))
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
  get isFilteredResultEmpty() {
    return this.filteredOwners.length === 0
  }

  @computed
  get selectedPixelCoordinates() {
    if (this.selectedPixel) {
      return AppStore.web3.pupperToPixelCoordsLocal(this.selectedPixel)
    }
    return []
  }

  @computed
  get selectedPixelHexColor() {
    return AppStore.web3.pupperToHexLocal(this.selectedPixel!)
  }

  @computed
  get seletedPixelIndex() {
    return AppStore.web3.pupperToIndexLocal(this.selectedPixel!)
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
      description = this.selectedActivityTransfer.to
    } else if (this.selectedActivityTransfer.to === ethers.constants.AddressZero) {
      title = "Burned"
      description = this.selectedActivityTransfer.from
    } else {
      title = "Transfer"
      description = `${this.selectedActivityTransfer.from} to ${this.selectedActivityTransfer.to}`
    }
    return {title, description}
  }

  destroy() {
    return this.disposeReactions()
  }
}

export default LeaderborkStore

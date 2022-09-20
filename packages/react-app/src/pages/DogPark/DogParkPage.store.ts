import {computed, makeObservable, observable} from "mobx";
import { ObjectKeys } from "../../helpers/objects";
import AppStore from "../../store/App.store";
import {arrayFuzzyFilterByKey} from "../../helpers/arrays";
import { Reactionable } from "../../services/mixins/reactionable";
import { EmptyClass } from "../../helpers/mixins";
import {ethers} from "ethers";
import {abbreviate} from "../../helpers/strings";

export interface PixelOwnerInfo {
  address: string;
  pixels: number[];
  ens: string | null
}

class DogParkPageStore extends Reactionable(EmptyClass) {

  @observable
  addressToSearch = ""

  @observable
  selectedAddress?: string

  @observable
  selectedPixel: number | null = null

  @observable
  lockedDog: number | null = null

  constructor(selectedAddress?: string, selectedPupper?: number) {
    super()
    makeObservable(this)

    if (selectedAddress) {
      this.addressToSearch = selectedAddress
      this.selectedAddress = selectedAddress
    }

    if (selectedPupper) {
      this.selectedPixel = selectedPupper
    }

    this.react(() => this.addressToSearch, (value, prevValue) => {
      //@ts-ignore
      if ((this.selectedAddress && value.length === prevValue.length - 1) || value === "") {
        this.selectedAddress = undefined
        this.addressToSearch = ""
      }
    })
  }

  init() {
    AppStore.web3.getDogLocked().then(balance => {
      this.lockedDog = Number(balance)
    })
    AppStore.web3.getPixelOwnershipMap()
  }

  @computed
  get filteredOwners() {
    return arrayFuzzyFilterByKey(AppStore.web3.sortedPixelOwners, this.addressToSearch, 'address')
        .concat(arrayFuzzyFilterByKey(AppStore.web3.sortedPixelOwners, this.addressToSearch, 'ens'))
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
  get isSearchInputEmpty() {
    return this.addressToSearch === ""
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

  destroy() {
    return this.disposeReactions()
  }
}

export default DogParkPageStore

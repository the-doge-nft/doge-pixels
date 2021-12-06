import {computed, makeObservable, observable} from "mobx";
import { ObjectKeys } from "../../helpers/objects";
import AppStore from "../../store/App.store";
import {arrayFuzzyFilterByKey} from "../../helpers/arrays";
import { Reactionable } from "../../services/mixins/reactionable";
import { EmptyClass } from "../../helpers/mixins";
import {ethers} from "ethers";
import {abbreviate} from "../../helpers/strings";

class DogParkPageStore extends Reactionable(EmptyClass) {

  @observable
  addressToSearch = ""

  @observable
  selectedAddress?: string

  @observable
  selectedPupper: number | null = null

  constructor(selectedAddress?: string, selectedPupper?: number) {
    super()
    makeObservable(this)

    if (selectedAddress) {
      this.addressToSearch = selectedAddress
      this.selectedAddress = selectedAddress
    }

    if (selectedPupper) {
      this.selectedPupper = selectedPupper
    }

    this.react(() => this.addressToSearch, (value, prevValue) => {
      //@ts-ignore
      if ((this.selectedAddress && value.length === prevValue.length - 1) || value === "") {
        this.selectedAddress = undefined
        this.addressToSearch = ""
      }
    })
  }

  @computed
  get topDogs(): {address: string, puppers: number[], ens?: string}[] {
    const tds = ObjectKeys(AppStore.web3.addressToPuppers).map((key, index, arr) => (
      {address: key, puppers: AppStore.web3.addressToPuppers![key].tokenIDs, ens: AppStore.web3.addressToPuppers![key].ens}
    ))
    return tds
      .filter(dog => dog.address !== ethers.constants.AddressZero)
      .filter(dog => dog.puppers.length > 0)
      .sort((a, b) => {
        if (a.puppers.length > b.puppers.length) {
          return -1
        } else if (a.puppers.length < b.puppers.length) {
          return 1
        } else {
          return 0
        }
      })
  }

  @computed
  get filteredDogs() {
    return arrayFuzzyFilterByKey(this.topDogs, this.addressToSearch, 'address').concat(arrayFuzzyFilterByKey(this.topDogs, this.addressToSearch, 'ens'))
  }

  @computed
  get selectedDogs() {
    return this.topDogs.filter(dog => dog.address === this.selectedAddress)[0]
  }

  @computed
  get selectedUserHasPuppers() {
    return this.selectedDogs?.puppers.length > 0
  }

  @computed
  get isSearchInputEmpty() {
    return this.addressToSearch === ""
  }

  @computed
  get isFilteredResultEmpty() {
    return this.filteredDogs.length === 0
  }

  @computed
  get selectedPupperCoords() {
    if (this.selectedPupper) {
      return AppStore.web3.pupperToPixelCoordsLocal(this.selectedPupper)
    }
    return []
  }

  @computed
  get selectedPupperHex() {
    return AppStore.web3.pupperToHexLocal(this.selectedPupper!)
  }

  @computed
  get seletedPupperIndex() {
    return AppStore.web3.pupperToIndexLocal(this.selectedPupper!)
  }

  @computed
  get isSelectedAddressAuthedUser() {
    return this.selectedAddress === AppStore.web3.address
  }

  @computed
  get selectedAddressDisplayName() {
    if (this.selectedAddress) {
      if (this.selectedDogs?.ens) {
        return this.selectedDogs.ens
      } else {
        return abbreviate(this.selectedAddress)
      }
    }
    return "None"
  }

}

export default DogParkPageStore

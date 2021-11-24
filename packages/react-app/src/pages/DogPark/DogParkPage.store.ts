import {computed, makeObservable, observable} from "mobx";
import { ObjectKeys } from "../../helpers/objects";
import AppStore from "../../store/App.store";
import {arrayFuzzyFilterByKey} from "../../helpers/arrays";
import { Reactionable } from "../../services/mixins/reactionable";
import { EmptyClass } from "../../helpers/mixins";
import {ethers} from "ethers";

class DogParkPageStore extends Reactionable(EmptyClass) {

  @observable
  addressToSearch = ""

  @observable
  selectedAddress?: string

  @observable
  selectedPupper?: number

  constructor(selectedAddress?: string, selectedPupper?: number) {
    super()
    makeObservable(this)

    if (selectedAddress) {
      this.addressToSearch = selectedAddress
      const addresses = this.topDogs.map(dog => dog.address)
      // if (addresses.includes(selectedAddress)) {
      //   alert("set selected address")
      this.selectedAddress = selectedAddress
      // }
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
  get topDogs(): {address: string, puppers: number[]}[] {
    const tds = ObjectKeys(AppStore.web3.addressToPuppers).map((key, index, arr) => (
      {address: key, puppers: AppStore.web3.addressToPuppers![key]}
    ))
    return tds
      .filter(dog => dog.address !== ethers.constants.AddressZero)
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
    return arrayFuzzyFilterByKey(this.topDogs, this.addressToSearch, 'address')
  }

  @computed
  get selectedDogs() {
    return this.topDogs.filter(dog => dog.address === this.selectedAddress)
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
  get selectedPupperLocation() {
    return "Dog"
  }

}

export default DogParkPageStore

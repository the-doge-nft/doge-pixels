import {makeObservable, observable} from "mobx";
import AppStore from "../../store/App.store";

class MobileHomeStore {

  @observable
  isMintDrawerOpen = false

  @observable
  isBurnDrawerOpen = false

  constructor() {
    makeObservable(this)
  }

  init() {
    AppStore.web3.refreshPixelOwnershipMap()
  }
}

export default MobileHomeStore

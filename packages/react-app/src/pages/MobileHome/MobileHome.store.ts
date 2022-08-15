import {makeObservable, observable} from "mobx";
import AppStore from "../../store/App.store";

class MobileHomeStore {

  @observable
  isMintDrawerOpen = false

  @observable
  isBurnDrawerOpen = false

  @observable
  isShareModal = false

  constructor() {
    makeObservable(this)
  }

  init() {
    AppStore.web3.refreshPupperOwnershipMap()
  }
  
  share(type: string) {
    console.log({type})
  }
}

export default MobileHomeStore

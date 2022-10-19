import { computed, makeObservable, observable } from "mobx";
import AppStore from "../../store/App.store";
import { PixelOwnerInfo } from "../Leaderbork/Leaderbork.store";

class MobileHomeStore {
  @observable
  isMintDrawerOpen = false;

  @observable
  isBurnDrawerOpen = false;

  @observable
  selectedPixel: number | null = null;

  constructor() {
    makeObservable(this);
  }

  init() {
    AppStore.web3.refreshPixelOwnershipMap();
  }

  @computed
  get selectedOwner(): PixelOwnerInfo | undefined {
    return AppStore.web3.sortedPixelOwners.filter(dog => dog.address === AppStore.web3.address)[0];
  }
}

export default MobileHomeStore;

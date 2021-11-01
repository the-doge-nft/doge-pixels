import { makeObservable, observable } from "mobx";

class ViewerStore {
  @observable
  isMintModalOpen = false;

  constructor() {
    makeObservable(this);
  }
}

export default ViewerStore;

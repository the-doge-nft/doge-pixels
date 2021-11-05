import { computed, makeObservable, observable } from "mobx";

class MintPixelsModalStore {
  @observable
  view: "mint" | "loading" | "complete" = "mint";

  @observable
  pixel_count?: number;

  @observable
  dog_count: number = 0;

  constructor() {
    makeObservable(this);
  }

  @computed
  get dogCount() {
    if (this.pixel_count) {
      return Number(this.pixel_count * 55240).toString();
    } else {
      return Number(0).toString();
    }
  }
}

export default MintPixelsModalStore;

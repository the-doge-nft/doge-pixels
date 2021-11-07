import { computed, makeObservable, observable } from "mobx";
import { Navigable } from "../../services/mixins/navigable";
import { AbstractConstructor, EmptyClass } from "../../helpers/mixins";

type MintModalView = "mint" | "loading" | "complete";

class MintPixelsModalStore extends Navigable<AbstractConstructor, MintModalView>(EmptyClass) {
  @observable
  pixel_count?: number;

  @observable
  dog_count: number = 0;

  constructor() {
    super();
    this.pushNavigation("mint");
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

  @computed
  get stepperItems() {
    return [];
  }
}

export default MintPixelsModalStore;

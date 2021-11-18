import { action, makeObservable, observable } from "mobx";
import { THREE } from "@uniswap/sdk/dist/constants";
import {AbstractConstructor, EmptyClass} from "../../helpers/mixins";
import {Navigable} from "../../services/mixins/navigable";

export enum ViewerView {
  Index = "index",
  Manage = "manage",
  Selected = "selected"
}

class ViewerStore extends Navigable<AbstractConstructor, ViewerView>(EmptyClass){
  @observable
  isMintModalOpen = false;

  @observable
  isBurnModalOpen = false;

  @observable
  selectedPixel: THREE.Vector3 | null = null;

  @observable
  pixelX: number | null = null;

  @observable
  pixelY: number | null = null;

  constructor() {
    super()
    this.pushNavigation(ViewerView.Index)
    makeObservable(this);
  }

  @action
  clearPixelPosition() {
    this.pixelX = null;
    this.pixelY = null;
    this.selectedPixel = null;
  }

  get stepperItems() {
    return []
  }
}

export default ViewerStore;

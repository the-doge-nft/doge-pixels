import {action, computed, makeObservable, observable} from "mobx";
import {AbstractConstructor, EmptyClass} from "../../helpers/mixins";
import {Navigable} from "../../services/mixins/navigable";
import AppStore from "../../store/App.store";
import * as THREE from "three";
import { Eventable } from "../../services/mixins/eventable";


export enum ViewerView {
  Index = "index",
  Manage = "manage",
  Selected = "selected"
}

//@TODO passing generics to Navigable typing acknowledged of subclasses
class ViewerStore extends Navigable(Eventable(EmptyClass)){
  @observable
  isMintModalOpen = false;

  @observable
  isBurnModalOpen = false;

  @observable
  selectedPupper: number | null = null;

  @observable
  camera: any

  constructor() {
    super()
    this.pushNavigation(ViewerView.Index)
    makeObservable(this);
  }

  @action
  clearSelectedPupper() {
    this.selectedPupper = null;
  }

  get stepperItems() {
    return []
  }

  @computed
  get selectedPixelX() {
    return AppStore.web3.pupperToPixelCoordsLocal(this.selectedPupper!)[0]
  }

  @computed
  get selectedPixelY() {
    return AppStore.web3.pupperToPixelCoordsLocal(this.selectedPupper!)[1]
  }

  @computed
  get pupperNumber() {
    return this.selectedPupper! - AppStore.web3.PIXEL_TO_ID_OFFSET
  }

  @computed
  get selectePupperHex() {
    return "f02kjf"
  }

  @computed
  get isSelectedPupperOwned() {
    if (this.selectedPupper === null) {
      return false
    } else {
      return AppStore.web3.tokenIdsOwned.includes(this.selectedPupper)
    }
  }
}

export default ViewerStore;

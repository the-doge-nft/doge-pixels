import {action, computed, makeObservable, observable} from "mobx";
import {AbstractConstructor, EmptyClass} from "../../helpers/mixins";
import {Navigable} from "../../services/mixins/navigable";
import AppStore from "../../store/App.store";
import * as THREE from "three";
import { Eventable } from "../../services/mixins/eventable";
import { Reactionable } from "../../services/mixins/reactionable";


export enum ViewerView {
  Index = "index",
  Manage = "manage",
  Selected = "selected"
}

//@TODO passing generics to Navigable typing acknowledged of subclasses
class ViewerStore extends Navigable(Eventable(Reactionable((EmptyClass)))) {
  @observable
  isMintModalOpen = false;

  @observable
  isBurnModalOpen = false;

  @observable
  selectedPupper: number | null = null;

  @observable
  selectedURI?: any

  @observable
  tokenOwner: string | null = null

  @observable
  camera: any

  constructor() {
    super()
    this.pushNavigation(ViewerView.Index)
    makeObservable(this);
  }

  init() {
    this.react(() => this.selectedPupper, () => {
      AppStore.web3.pxContract!.tokenURI(this.selectedPupper!).then(res => {
        this.selectedURI = {
          imgUrl: "",
          description: {

          }
        }
        console.log("debug:: res", res)
      }).catch(e => {
        console.error("debug:: error", e)
      })

      AppStore.web3.pxContract!.ownerOf(this.selectedPupper!).then(res => {
        this.tokenOwner = res
        console.log("debug:: selected pixel belongs to", res)
      }).catch(e => {
        this.tokenOwner = null
        console.error("debug:: error", e)
      })
    }, {fireImmediately: false})
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

  destroy() {
    this.disposeReactions()
  }
}


export default ViewerStore;

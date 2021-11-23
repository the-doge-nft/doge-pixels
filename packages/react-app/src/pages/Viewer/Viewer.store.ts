import {action, computed, makeObservable, observable} from "mobx";
import {AbstractConstructor, EmptyClass} from "../../helpers/mixins";
import {Navigable} from "../../services/mixins/navigable";
import AppStore from "../../store/App.store";
import * as THREE from "three";
import { Eventable, SET_CAMERA } from "../../services/mixins/eventable";
import { Reactionable } from "../../services/mixins/reactionable";
import LocalStorage from "../../services/local-storage";


export enum ViewerView {
  Index = "index",
  Manage = "manage",
  Selected = "selected"
}

const SHOW_HELPER_MODAL = "show_helper_modal"

//@TODO passing generics to Navigable typing acknowledged of subclasses
class ViewerStore extends Navigable(Eventable(Reactionable((EmptyClass)))) {
  @observable
  isMintModalOpen = false;

  @observable
  isBurnModalOpen = false;

  @observable
  isHelperModalOpen = true;

  @observable
  selectedPupper: number | null = null;

  @observable
  selectedURI?: {imgUrl: string, description: {pupperLocation: string}}

  @observable
  tokenOwner: string | null = null

  @observable
  openSeaLink: string | null = null

  constructor(private _x: string | null, private _y?: string | null) {
    super()
    makeObservable(this);
    this.pushNavigation(ViewerView.Index)

    if (_x && _y) {
      console.log("debug:: xy", _x, _y)
      this.selectedPupper = AppStore.web3.coordinateToPupperLocal(Number(_x), Number(_y))
      this.pushNavigation(ViewerView.Selected)
    }
  }

  init() {
    this.react(() => this.selectedPupper, () => {
      AppStore.web3.pxContract!.tokenURI(this.selectedPupper!).then(res => {
        this.selectedURI = {
          imgUrl: "",
          description: {
            pupperLocation: "Pupper"
          }
        }
        // this.openSeaLink = "testlink"
      }).catch(e => {
        console.error("debug:: error", e)
      })

      AppStore.web3.pxContract!.ownerOf(this.selectedPupper!).then(res => {
        this.tokenOwner = res
      }).catch(e => {
        this.tokenOwner = null
        console.error("debug:: error", e)
      })
    }, {fireImmediately: false})

    this.isHelperModalOpen = LocalStorage.getItem(SHOW_HELPER_MODAL, LocalStorage.PARSE_JSON, true)
    LocalStorage.setItem(SHOW_HELPER_MODAL, false)
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
  get selectedPupperIndex() {
    return AppStore.web3.pupperToIndexLocal(this.selectedPupper!)
  }

  @computed
  get isSelectedPupperOwned() {
    if (this.selectedPupper === null) {
      return false
    } else {
      return AppStore.web3.puppersOwned.includes(this.selectedPupper)
    }
  }

  @computed
  get selectedPupperHEX() {
    //@TODO: mock for now
    return AppStore.web3.pupperToHexLocal(this.selectedPupper!)
  }

  async onManagePixelClick(pupper: number) {
    const [x, y] = await AppStore.web3.pupperToPixelCoords(pupper)
    const [x1, y1] = AppStore.web3.pupperToPixelCoordsLocal(pupper)
    if (x.toNumber() !== x1 || y.toNumber() !== y1) {
      throw Error("X,Y from contract and local do not agree")
    }
    this.selectedPupper = pupper
    this.publish(SET_CAMERA, [x.toNumber(), y.toNumber()])
    this.pushNavigation(ViewerView.Selected)
  }

  destroy() {
    this.disposeReactions()
  }
}


export default ViewerStore;

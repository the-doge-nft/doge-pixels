import {action, computed, makeObservable, observable} from "mobx";
import {Constructor, EmptyClass} from "../../helpers/mixins";
import {Navigable} from "../../services/mixins/navigable";
import AppStore from "../../store/App.store";
import {Eventable, SELECT_PIXEL} from "../../services/mixins/eventable";
import {Reactionable} from "../../services/mixins/reactionable";
import LocalStorage from "../../services/local-storage";
import {abbreviate} from "../../helpers/strings";
import ModalsStore from "../../store/Modals.store";
import axios from "axios";
import * as Sentry from "@sentry/react";
import {NamedRoutes, route, SELECTED_PIXEL_PARAM} from "../../App.routes";

export enum ViewerView {
  Index = "index",
  Manage = "manage",
  Selected = "selected"
}

export interface Metadata {
  attributes: {trait_type: string, value: string}[];
  description: string;
  external_url: string;
  image: string;
  name: string
}

export const VIEWED_PIXELS_LS_KEY = "viewed_pixels_by_id"

class ViewerStore extends (Eventable(Reactionable(Navigable<ViewerView, Constructor>(EmptyClass)))) {

  @observable
  selectedPupper: number | null = null;

  @observable
  selectedURI?: {imgUrl: string, description: {pupperLocation: string}}

  @observable
  tokenOwner: string | null = null

  @observable
  tokenOwnerENS: string | null = null

  @observable
  openSeaLink: string | null = null

  @observable
  metaData: Metadata | null = null

  @observable
  isSelectedDrawerOpen = false

  @observable
  modals: ModalsStore

  constructor(private defaultSelectedPupper: number | null) {
    super()
    makeObservable(this);
    this.modals = new ModalsStore()
    this.pushNavigation(ViewerView.Index)

    if (defaultSelectedPupper) {
      // @TODO - run some validation on default selected pixel
      // - make sure it is within bounds of image
      // - make sure it is a number

      this.selectedPupper = Number(defaultSelectedPupper)
      if (AppStore.rwd.isMobile) {
        this.isSelectedDrawerOpen = true
      } else {
        this.pushNavigation(ViewerView.Selected)
      }
    }
  }

  init() {
    this.modals.init()
    this.react(() => this.selectedPupper, async () => {
      console.log("debug:: new selected pixel", this.selectedPupper)
      if (this.selectedPupper) {
        this.getTokenOwner(this.selectedPupper)
        this.getTokenMetadata(this.selectedPupper)
      }
    }, {fireImmediately: true})
  }

  async getTokenOwner(tokenID: number) {
    try {
      this.tokenOwner = await AppStore.web3.getPxOwnerByTokenId(this.selectedPupper!)
    } catch (e) {
      console.log("debug:: token does not have an owner")
      this.tokenOwner = null
    }

    if (this.tokenOwner) {
      if (this.tokenOwner === AppStore.web3.address) {
        this.tokenOwnerENS = AppStore.web3.ens
      } else {
        AppStore.web3.getENSname(this.tokenOwner).then(({data}) => {
          this.tokenOwnerENS = data.ens
        })
      }
    }
  }

  async getTokenMetadata(tokenID: number) {
    try {
      const tokenURI = await AppStore.web3.pxContract!.tokenURI(this.selectedPupper!)
      const res = await axios.get(tokenURI)
      this.metaData = res.data
    } catch (e) {
      this.metaData = null
      console.log("could not get token metadata", e)
      Sentry.captureException(e)
    }
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

  // @TODO selecting PixelPane in ManagePane.tsx & SelectedPixelPane.tsx should call
  // similar functions from this store
  async onManagePixelClick(pupper: number) {
    this.pushNavigation(ViewerView.Selected)
    this.selectedPupper = pupper
    this.setPupperSeen(pupper)
    const [x, y] = await AppStore.web3.pupperToPixelCoords(pupper)
    const [x1, y1] = AppStore.web3.pupperToPixelCoordsLocal(pupper)
    if (x.toNumber() !== x1 || y.toNumber() !== y1) {
      throw Error(`X,Y from contract and local do not agree. Local: ${x1} ${y1}. Remote: ${x} ${y}`)
    }
    this.publish(SELECT_PIXEL, [x1, y1])
    window.history.pushState({}, "", route(NamedRoutes.PIXELS, {[SELECTED_PIXEL_PARAM]: pupper}))
  }

  @computed
  get selectedTokenOwnerDisplayName() {
    if (this.tokenOwnerENS) {
      return this.tokenOwnerENS
    } else if (this.tokenOwner) {
      return abbreviate(this.tokenOwner)
    } else {
      return "-"
    }
  }

  setPupperSeen(pupper: number) {
    const data = LocalStorage.getItem(VIEWED_PIXELS_LS_KEY, LocalStorage.PARSE_JSON,[])
    if (!data.includes(pupper)) {
      data.push(pupper)
    }
    LocalStorage.setItem(VIEWED_PIXELS_LS_KEY, data)
  }

  getIsPupperNew(pupper: number) {
    const data = LocalStorage.getItem(VIEWED_PIXELS_LS_KEY, LocalStorage.PARSE_JSON, [])
    let isNew = true
    if (data.includes(pupper)) {
      isNew = false
    }
    return isNew
  }

  destroy() {
    this.disposeReactions()
  }
}


export default ViewerStore;

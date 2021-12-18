import {action, computed, makeObservable, observable} from "mobx";
import {EmptyClass} from "../../helpers/mixins";
import {Navigable} from "../../services/mixins/navigable";
import AppStore from "../../store/App.store";
import {Eventable, SET_CAMERA} from "../../services/mixins/eventable";
import {Reactionable} from "../../services/mixins/reactionable";
import LocalStorage from "../../services/local-storage";
import {abbreviate} from "../../helpers/strings";
import ModalsStore from "../../store/Modals.store";

export enum ViewerView {
  Index = "index",
  Manage = "manage",
  Selected = "selected"
}

export const VIEWED_PIXELS_LS_KEY = "viewed_pixels_by_id"

//@TODO passing generics to Navigable typing acknowledged of subclasses
class ViewerStore extends Navigable(Eventable(Reactionable((EmptyClass)))) {

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
  isSelectedDrawerOpen = false

  @observable
  modals: ModalsStore

  constructor(private _x: string | null, private _y?: string | null) {
    super()
    makeObservable(this);
    this.modals = new ModalsStore()
    this.pushNavigation(ViewerView.Index)

    if (_x && _y) {
      this.selectedPupper = AppStore.web3.coordinateToPupperLocal(Number(_x), Number(_y))
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
      try {
        if (this.selectedPupper) {
          this.tokenOwner = await AppStore.web3.getPxOwnerByTokenId(this.selectedPupper!)
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

        try {
          // const tokenURI = await AppStore.web3.pxContract!.tokenURI(this.selectedPupper!)
          // @TODO: partyka - current ipfs links do not work
          // https://ipfs.io/ipns/k51qzi5uqu5djqiqaht7oyvstxe24g4zk4lgt4nf92q7b4t9x3xjoqzkvmha1w/metadata/metadata-22_2.json
          this.selectedURI = {
            imgUrl: "",
            description: {
              pupperLocation: "Pupper"
            }
          }
        } catch (e) {
          console.log("debug:: token URI not found for token that is owned - THIS IS BAAD")
        }
      } catch (e) {
        // @TODO filter if owner is 0 address
        console.log("debug:: token does not have an owner")
        this.tokenOwner = null
      }
    }, {fireImmediately: true})
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
    this.publish(SET_CAMERA, [x1, y1])
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

import { action, computed, makeObservable, observable } from "mobx";
import { NamedRoutes, route, SELECTED_PIXEL_PARAM } from "../../App.routes";
import { EmptyClass } from "../../helpers/mixins";
import { Http } from "../../services";
import { Eventable, SELECT_PIXEL } from "../../services/mixins/eventable";
import { Reactionable } from "../../services/mixins/reactionable";
import AppStore from "../../store/App.store";

export enum ViewerView {
  Index = "index",
  Manage = "manage",
  Selected = "selected",
}

export interface Metadata {
  attributes: { trait_type: string; value: string }[];
  description: string;
  external_url: string;
  image: string;
  name: string;
}

class ViewerStore extends Eventable(Reactionable(EmptyClass)) {
  @observable
  selectedPupper: number | null = null;

  @observable
  selectedURI?: { imgUrl: string; description: { pupperLocation: string } };

  @observable
  tokenOwner: string | null = null;

  @observable
  tokenOwnerENS: string | null = null;

  @observable
  openSeaLink: string | null = null;

  @observable
  metaData: Metadata | null = null;

  constructor(private defaultSelectedPupper?: number) {
    super();
    makeObservable(this);

    if (defaultSelectedPupper && AppStore.web3.isPixelIDValid(Number(defaultSelectedPupper))) {
      this.selectedPupper = Number(defaultSelectedPupper);
      AppStore.modals.isSelectedPixelModalOpen = true;
    }

    if (!defaultSelectedPupper && AppStore.modals.isSelectedPixelModalOpen) {
      AppStore.modals.isSelectedPixelModalOpen = false;
    }
  }

  init() {
    this.react(
      () => this.selectedPupper,
      async () => {
        if (this.selectedPupper) {
          this.getTokenOwner(this.selectedPupper);
          // Don't get token metadata for now -- all data is shown locally on the frontend
          // we can put some caching mechanism in place if we want to query metadata directly
          // this.getTokenMetadata(this.selectedPupper)
        }
      },
      { fireImmediately: true },
    );
  }

  @action
  async getTokenOwner(tokenId: number) {
    try {
      this.tokenOwner = await AppStore.web3.getPxOwnerByTokenId(tokenId);
    } catch (e) {
      this.tokenOwner = null;
    }

    if (this.tokenOwner) {
      if (this.tokenOwner === AppStore.web3.address) {
        this.tokenOwnerENS = AppStore.web3.ens;
      } else {
        AppStore.web3.getENSname(this.tokenOwner).then(({ data }) => {
          this.tokenOwnerENS = data.ens;
        });
      }
    }
  }

  async getTokenMetadata(tokenId: number) {
    try {
      const res = await Http.get(`/v1/px/metadata/${tokenId}`);
      this.metaData = res.data;
    } catch (e) {
      this.metaData = null;
    }
  }

  @action
  clearSelectedPupper() {
    this.selectedPupper = null;
  }

  get stepperItems() {
    return [];
  }

  @computed
  get selectedPixelX() {
    return AppStore.web3.pupperToPixelCoordsLocal(this.selectedPupper!)[0];
  }

  @computed
  get selectedPixelY() {
    return AppStore.web3.pupperToPixelCoordsLocal(this.selectedPupper!)[1];
  }

  @computed
  get selectedPupperIndex() {
    return AppStore.web3.pupperToIndexLocal(this.selectedPupper!);
  }

  @computed
  get isSelectedPupperOwned() {
    if (this.selectedPupper === null) {
      return false;
    } else {
      return AppStore.web3.puppersOwned.includes(this.selectedPupper);
    }
  }

  @computed
  get selectedPupperHEX() {
    //@TODO: mock for now
    if (this.selectedPupper) {
      return AppStore.web3.pupperToHexLocal(this.selectedPupper);
    }
    return null;
  }

  // @TODO selecting PixelPane in ManagePane.tsx & SelectedPixelPane.tsx should call
  // similar functions from this store
  async onManagePixelClick(pupper: number) {
    if (!AppStore.modals.isSelectedPixelModalOpen) {
      AppStore.modals.isSelectedPixelModalOpen = true;
    }
    this.selectedPupper = pupper;
    AppStore.web3.setPupperSeen(pupper);
    const [x, y] = await AppStore.web3.pupperToPixelCoords(pupper);
    const [x1, y1] = AppStore.web3.pupperToPixelCoordsLocal(pupper);
    if (x.toNumber() !== x1 || y.toNumber() !== y1) {
      throw Error(`X,Y from contract and local do not agree. Local: ${x1} ${y1}. Remote: ${x} ${y}`);
    }
    this.publish(SELECT_PIXEL, [x1, y1]);
    window.history.pushState({}, "", route(NamedRoutes.PIXELS, { [SELECTED_PIXEL_PARAM]: pupper }));
  }

  @computed
  get selectedTokenOwnerDisplayName() {
    if (this.tokenOwner) {
      return AppStore.web3.getAddressDisplayName(this.tokenOwner);
    }
    return "-";
  }

  destroy() {
    this.disposeReactions();
  }

  @action
  onPixelSelected(x: number, y: number) {
    this.selectedPupper = AppStore.web3.coordinateToPupperLocal(x, y);
    if (!AppStore.modals.isSelectedPixelModalOpen) {
      AppStore.modals.isSelectedPixelModalOpen = true;
    }
    window.history.pushState({}, "", route(NamedRoutes.PIXELS, { [SELECTED_PIXEL_PARAM]: this.selectedPupper }));
  }

  onCoordsSearch(x: number, y: number) {
    this.onPixelSelected(x, y);
    this.publish(SELECT_PIXEL, [x, y]);
  }
}

export default ViewerStore;

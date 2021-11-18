import { action, makeObservable, observable } from "mobx";
import { THREE } from "@uniswap/sdk/dist/constants";

class ViewerStore {
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
    makeObservable(this);
  }

  @action
  clearPixelPosition() {
    this.pixelX = null;
    this.pixelY = null;
    this.selectedPixel = null;
  }
}

export default ViewerStore;

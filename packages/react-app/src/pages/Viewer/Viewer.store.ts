import { makeObservable, observable } from "mobx";
import { THREE } from "@uniswap/sdk/dist/constants";

class ViewerStore {
  @observable
  isMintModalOpen = false;

  @observable
  selectedPixel?: THREE.Vector3;

  @observable
  pixelX?: number;

  @observable
  pixelY?: number;

  constructor() {
    makeObservable(this);
  }
}

export default ViewerStore;

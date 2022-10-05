import { makeObservable } from "mobx";
import MintPixelsDialogStore from "../../../common/MintPixels/MintPixelsDialog.store";

class MintPixelsDrawerStore extends MintPixelsDialogStore {
  constructor() {
    super();
    makeObservable(this);
  }

  init() {
    super.init();
  }
}

export default MintPixelsDrawerStore;

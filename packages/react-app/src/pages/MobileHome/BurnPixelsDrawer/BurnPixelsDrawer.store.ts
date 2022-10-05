import { makeObservable } from "mobx";
import BurnPixelsDialogStore from "../../../common/BurnPixels/BurnPixelsDialog.store";

class BurnPixelsDrawerStore extends BurnPixelsDialogStore {
  constructor(defaultPixel: number | null) {
    super(defaultPixel);
    makeObservable(this);
  }
}

export default BurnPixelsDrawerStore;

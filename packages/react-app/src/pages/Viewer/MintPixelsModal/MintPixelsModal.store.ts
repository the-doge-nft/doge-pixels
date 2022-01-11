import {makeObservable} from "mobx";
import MintPixelsDialogStore from "../../../common/MintPixels/MintPixelsDialog.store";


class MintPixelsModalStore extends MintPixelsDialogStore {

  constructor() {
    super()
    makeObservable(this)
  }

  init() {
    super.init()
  }
}

export default MintPixelsModalStore;

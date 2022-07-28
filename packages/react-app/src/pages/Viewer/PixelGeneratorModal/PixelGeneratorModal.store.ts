import {makeObservable} from "mobx";
import PixelGeneratorDialogStore from "../../../common/PixelGenerator/PixelGeneratorDialog.store";

class PixelGeneratorModalStore extends PixelGeneratorDialogStore {

 constructor() {
   super();
   makeObservable(this)
 }

}

export default PixelGeneratorModalStore

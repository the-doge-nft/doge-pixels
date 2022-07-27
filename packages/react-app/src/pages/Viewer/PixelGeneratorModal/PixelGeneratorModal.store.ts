import {makeObservable} from "mobx";
import PixelGeneratorDialogStore from "../../../common/PixelGenerator/PixelGeneratorDialog.store";

class PixelGeneratorModalStore extends PixelGeneratorDialogStore {

 constructor(defaultPixel: number | null) {
   super(defaultPixel);
   makeObservable(this)
 }

}

export default PixelGeneratorModalStore

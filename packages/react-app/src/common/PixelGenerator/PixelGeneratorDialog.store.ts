import {computed, makeObservable, observable} from "mobx";
import {Navigable} from "../../services/mixins/navigable";
import {Constructor, EmptyClass} from "../../helpers/mixins";
import AppStore from "../../store/App.store";

export enum PixelGeneratorModalView {
  Select = "select",
  LoadingGenerate = "generating",
  Complete = "complete"
}

class PixelGeneratorDialogStore extends Navigable<PixelGeneratorModalView, Constructor>(EmptyClass){

  @observable
  selectedColor: string = ''

  @observable
  hasUserSignedTx: boolean = false

  @observable
  txHash: string | null = null
  
  @observable
  gridColors: string[] = []

  constructor() {
    super();
    makeObservable(this)
    this.pushNavigation(PixelGeneratorModalView.Select)
    
    // Initialize the Grid pane with 20 * 20
    const initialColors = ["white", "#180e3012"];
    for (let i = 0; i < 400; i ++) {
      if ((i + Math.floor(i / 20)) % 2  === 0) {
        this.gridColors[i] = "white";
      } else {
        this.gridColors[i] = "#180e3012";
      }
    }
    if (AppStore.web3.puppersOwned.length > 0 ) {
      this.selectedColor = AppStore.web3.pupperToHexLocal(AppStore.web3.puppersOwned[0])
    }
  }

  get stepperItems() {
    return []
  }

  handlePixelSelect(color: string) {
    this.selectedColor = color
  }
  
  onPaint(index: number) {
    const tempGrids = this.gridColors.slice();
    tempGrids[index] = this.selectedColor;
    this.gridColors = tempGrids.slice();
  }

  @computed
  get isUserPixelOwner() {
    return AppStore.web3.puppersOwned.length > 0
  }
}

export default PixelGeneratorDialogStore


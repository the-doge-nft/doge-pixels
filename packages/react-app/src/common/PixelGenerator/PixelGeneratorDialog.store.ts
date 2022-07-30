import {computed, makeObservable, observable} from "mobx";
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";

import {Navigable} from "../../services/mixins/navigable";
import {Constructor, EmptyClass} from "../../helpers/mixins";
import AppStore from "../../store/App.store";
import * as Sentry from "@sentry/react";
import {showErrorToast} from "../../DSL/Toast/Toast";

export enum PixelGeneratorModalView {
  Select = "select",
  LoadingGenerate = "generating",
  Complete = "complete"
}

class PixelGeneratorDialogStore extends Navigable<PixelGeneratorModalView, Constructor>(EmptyClass){

  @observable
  selectedColor: string = ""
  
  // color for grid when painting
  @observable
  gridColors: string[] = []

  // colors for png when downloading
  @observable
  pngColors: string[] = [];

  // coordinate x of the paint tool
  @observable
  toolX: number = 0;

  // coordinate y of the paint tool
  @observable
  toolY: number = 0;
  
  // type of draw tool
  @observable
  drawType: string = 'pencil';
  

  constructor() {
    super();
    makeObservable(this)
    this.pushNavigation(PixelGeneratorModalView.Select)
    
    // Initialize the Grid pane with 20 * 20
    for (let i = 0; i < 400; i ++) {
      if ((i + Math.floor(i / 20)) % 2  === 0) {
        this.gridColors[i] = "white";
      } else {
        this.gridColors[i] = "#180e3012";
      }

      // initial background
      this.pngColors[i] = "white";
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
    let color = this.selectedColor;
    if (this.drawType === 'eraser') {
      if ((index + Math.floor(index / 20)) % 2  === 0) {
        color = "white";
      } else {
        color = "#180e3012";
      }
      if (color === this.gridColors[index]) {
        return;
      }
    }
    let tempGrids = this.gridColors.slice();
    tempGrids[index] = color;
    this.gridColors = tempGrids.slice();
    
    tempGrids = this.pngColors.slice();
    tempGrids[index] = color;
    this.pngColors = tempGrids.slice();
  }
  
  setDrawType(type: string) {
    this.drawType = type;
  }

  setPaintToolCoordinate(x: number, y: number) {
    const newX = this.toolX + x;
    const newY = this.toolY + y;
    if (newX < 0) {
      this.toolX = 0;
    } else if (newX > 400 - 40) {
      this.toolX = 400 - 40;
    } else {
      this.toolX = newX;
    }

    if (newY < 0) {
      this.toolY = 0;
    } else if (newY > 400 - 40) {
      this.toolY = 400 - 40;
    } else {
      this.toolY = newY;
    }
  }

  async generatingPixels() {
    try {
      const node = document.getElementById("my-art");

      if (!node) {
        throw new Error("No element");
      }
      const dataUrl = await htmlToImage.toPng(node);
      this.download(dataUrl, "myart.png");
      this.pushNavigation(PixelGeneratorModalView.Complete)
    } catch (e) {
      Sentry.captureException(e)
      console.error(e)
      showErrorToast("Error generating pixels")
      this.popNavigation()
    }
  }

  download(dataUrl: string, filename: string) {
    var link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }
  

  @computed
  get isUserPixelOwner() {
    return AppStore.web3.puppersOwned.length > 0
  }
}

export default PixelGeneratorDialogStore


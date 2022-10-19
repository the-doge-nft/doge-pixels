import { ethers } from "ethers";
import { action, computed, makeObservable, observable } from "mobx";
import { EmptyClass } from "../../helpers/mixins";
import { ObjectKeys } from "../../helpers/objects";
import { Reactionable } from "../../services/mixins/reactionable";
import AppStore from "../../store/App.store";
import { ActionInterface } from "./PixelArtActions";
import { CanvasSize, PixelArtCanvas } from "./PixelArtCanvas";
import KobosuJson from "../../images/kobosu.json";
import { getRandomIntInclusive } from "../../helpers/numbers";

export type PalletType = "user" | "random";
export interface Palette {
  tokenId: number;
  hex: string;
}

const MAX_ACTIONS_CN = 50;

export class Sticker {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  imageBase64: string;
  image?: HTMLImageElement;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = 1;
    this.height = 1;
    this.rotation = 0;
    this.imageBase64 = "";
  }

  set(x: number, y: number, width: number, height: number, rotation: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rotation = rotation;
  }
}

class PixelArtPageStore extends Reactionable(EmptyClass) {
  @observable
  selectedAddress: string;

  @observable
  selectedBrushPixelIndex: number;

  @observable
  selectedToolIndex: number;

  @observable
  undoActions: ActionInterface[];
  @observable
  redoActions: ActionInterface[];

  @observable
  templateImage: string;
  @observable
  templateLeft: number;
  @observable
  templateTop: number;
  @observable
  templateWidth: number;
  @observable
  templateHeight: number;
  @observable
  isTemplateVisible: boolean;

  @observable
  stickers: Sticker[];
  @observable
  stickersHack: number;

  @observable
  isImportTemplateModalOpened: boolean;
  @observable
  isImportStickerModalOpened: boolean;
  @observable
  isCanvasPropertiesModalOpened: boolean;
  @observable
  isPaletteModalOpened: boolean;

  @observable
  private _paletteType: PalletType;

  pixelsCanvas: PixelArtCanvas;

  @observable
  randomPalette: Palette[];

  constructor() {
    super();
    makeObservable(this);

    this.pixelsCanvas = new PixelArtCanvas(CanvasSize.S);

    this.selectedAddress = "0xd801d86C10e2185a8FCBccFB7D7baF0A6C5B6BD5";

    this.selectedBrushPixelIndex = 0;

    this.selectedToolIndex = 0;

    this.undoActions = [];
    this.redoActions = [];

    this.templateImage = "";
    this.templateLeft = 0;
    this.templateTop = 0;
    this.templateWidth = 1;
    this.templateHeight = 1;
    this.isTemplateVisible = true;

    this.stickers = [];
    this.stickersHack = 0;

    this.isImportTemplateModalOpened = false;
    this.isCanvasPropertiesModalOpened = false;
    this.isImportStickerModalOpened = false;

    this.tryLoadProject();
    this.getRandomPalette();

    if (AppStore.web3.isConnected) {
      this.paletteType = "user";
    } else {
      this.paletteType = "random";
    }

    this.react(
      () => AppStore.web3.signer,
      () => {
        if (!AppStore.web3.signer && this.paletteType === "user") {
          this.paletteType = "random";
        }
      },
    );
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.pixelsCanvas.canvas = canvas;
    this.pixelsCanvas.updateCanvas();
  }

  newProject() {
    this.clearActions();
    this.pixelsCanvas.resize(CanvasSize.S);
    this.stickers = [];
    this.templateImage = "";
    this.templateLeft = 0;
    this.templateTop = 0;
    this.templateWidth = 1;
    this.templateHeight = 1;
    this.selectedBrushPixelIndex = 0;
    this.selectedToolIndex = 0;
    localStorage.removeItem("art-prj");
  }

  saveProject() {
    let info = {
      meta: {
        version: 0,
      },
      canvas: this.pixelsCanvas.saveInfo(),
      stickers: this.saveStickersInfo(),
      template: this.saveTemplateInfo(),
    };
    localStorage.setItem("art-prj", JSON.stringify(info));
  }

  tryLoadProject() {
    const data: any = localStorage.getItem("art-prj");
    if (data) {
      const info = JSON.parse(data);
      //console.log(data.length);
      //console.log(info);
      this.pixelsCanvas.loadInfo(info.canvas);
      this.loadStickersInfo(info.stickers);
      this.loadTeamplateInfo(info.template);
    }
  }

  saveStickersInfo() {
    return this.stickers.map(value => {
      return {
        x: value.x,
        y: value.y,
        width: value.width,
        height: value.height,
        rotation: value.rotation,
        imageBase64: value.imageBase64,
      };
    });
  }

  loadStickersInfo(info: any) {
    //console.log(info);
    this.stickers = [];
    for (let entry of info) {
      let sticker = new Sticker();
      sticker.x = entry.x;
      sticker.y = entry.y;
      sticker.width = entry.width;
      sticker.height = entry.height;
      sticker.rotation = entry.rotation;
      sticker.imageBase64 = entry.imageBase64;
      this.stickers.push(sticker);
    }
  }

  saveTemplateInfo() {
    return {
      x: this.templateLeft,
      y: this.templateTop,
      width: this.templateWidth,
      height: this.templateHeight,
      imageBase64: this.templateImage,
      isVisible: this.isTemplateVisible,
    };
  }

  loadTeamplateInfo(info: any) {
    //console.log(info);
    this.templateLeft = info.x;
    this.templateTop = info.y;
    this.templateWidth = info.width;
    this.templateHeight = info.height;
    this.templateImage = info.imageBase64;
    this.isTemplateVisible = info.isVisible;
  }

  @action
  refreshStickers() {
    this.stickersHack = (this.stickersHack + 1) % 10;
    //console.log('refreshStickers', this.stickersHack);
  }

  @action
  clearActions() {
    this.undoActions = [];
    this.redoActions = [];
  }

  @action
  pushAction(action: ActionInterface) {
    //console.log('pushAction', action);
    this.undoActions.push(action);
    this.redoActions = [];
    if (this.undoActions.length > MAX_ACTIONS_CN) {
      this.undoActions.pop();
    }
  }

  @action
  undoAction() {
    if (this.undoActions.length) {
      const action: ActionInterface | undefined = this.undoActions.pop();
      if (action) {
        action.undo(this);
        this.redoActions.push(action);
      }
    }
  }
  @action
  redoAction() {
    if (this.redoActions.length) {
      const action: ActionInterface | undefined = this.redoActions.pop();
      if (action) {
        action.redo(this);
        this.undoActions.push(action);
      }
    }
  }

  @computed
  get palette(): { tokenId: number; hex: string }[] {
    if (this.paletteType === "user") {
      return this.userPalette;
    } else if (this.paletteType === "random") {
      return this.randomPalette;
    }
    return [];
  }

  @computed
  get userPalette() {
    return AppStore.web3.puppersOwned
      .map(px => {
        return {
          tokenId: px,
          hex: AppStore.web3.pupperToHexLocal(px),
        };
      })
      .sort((a, b) => {
        return a.hex.localeCompare(b.hex);
      });
  }

  toggleTemplateVisibility() {
    return (this.isTemplateVisible = !this.isTemplateVisible);
  }

  @action
  getRandomPalette() {
    const palette: Palette[] = [];
    const count = 25;
    const height = KobosuJson.length;
    for (let i = 0; i < count; i++) {
      const y = getRandomIntInclusive(0, height - 1);
      const x = getRandomIntInclusive(0, KobosuJson[y].length - 1);
      const pupper = AppStore.web3.coordinateToPupperLocal(x, y);
      palette.push({
        tokenId: pupper,
        hex: KobosuJson[y][x],
      });
    }
    this.randomPalette = palette;
  }

  @computed
  get isRandomPaletteActive() {
    return this.paletteType === "random";
  }

  get paletteType() {
    return this._paletteType;
  }

  set paletteType(type) {
    this._paletteType = type;
    this.selectedBrushPixelIndex = 0;
  }
}

export default PixelArtPageStore;

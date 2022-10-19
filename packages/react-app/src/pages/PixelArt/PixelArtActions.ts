import { sha512 } from "ethers/lib/utils";
import { TRANSPARENT_PIXEL } from "./PixelArtCanvas";
import PixelArtPageStore, { Sticker } from "./PixelArtPage.store";

export interface ActionInterface {
  undo(store: PixelArtPageStore): void;
  redo(store: PixelArtPageStore): void;
  isValid(): boolean;
}

class PixelInfo {
  x: number = 0;
  y: number = 0;
  color: string = TRANSPARENT_PIXEL;
}

export class PixelAction implements ActionInterface {
  color: string = TRANSPARENT_PIXEL;
  pixels: PixelInfo[] = [];

  constructor(color: string) {
    this.color = color;
  }

  update(store: PixelArtPageStore, x: number, y: number): void {
    const previousColor = store.pixelsCanvas.getPixelColor(x, y);
    if (previousColor !== this.color) {
      this.pixels.push({
        x,
        y,
        color: previousColor,
      });
      store.pixelsCanvas.setPixelColor(x, y, this.color);
    }
  }

  redo(store: PixelArtPageStore) {
    for (const pixelInfo of this.pixels) {
      store.pixelsCanvas.setPixelColor(pixelInfo.x, pixelInfo.y, this.color);
    }
  }

  undo(store: PixelArtPageStore) {
    for (const pixelInfo of this.pixels) {
      store.pixelsCanvas.setPixelColor(pixelInfo.x, pixelInfo.y, pixelInfo.color);
    }
  }

  isValid() {
    return this.pixels.length > 0;
  }
}

export class ClearCanvasAction extends PixelAction {
  constructor(store: PixelArtPageStore) {
    super(TRANSPARENT_PIXEL);

    for (let cy = 0; cy < store.pixelsCanvas.canvasSize; ++cy) {
      for (let cx = 0; cx < store.pixelsCanvas.canvasSize; ++cx) {
        this.update(store, cx, cy);
      }
    }
  }
}

export class AddStickerAction implements ActionInterface {
  sticker: Sticker;
  constructor(sticker: Sticker) {
    this.sticker = sticker;
  }
  undo(store: PixelArtPageStore): void {
    store.stickers.pop();
  }
  redo(store: PixelArtPageStore): void {
    store.stickers.push(this.sticker);
  }
  isValid(): boolean {
    return true;
  }
}

export class RemoveStickerAction implements ActionInterface {
  sticker: Sticker;
  index: number;
  constructor(sticker: Sticker) {
    this.sticker = sticker;
    this.index = 0;
  }
  do(store: PixelArtPageStore): void {
    this.redo(store);
  }
  undo(store: PixelArtPageStore): void {
    store.stickers.splice(this.index, 0, this.sticker);
  }
  redo(store: PixelArtPageStore): void {
    this.index = store.stickers.findIndex(entry => {
      return entry === this.sticker;
    });
    store.stickers.splice(this.index, 1);
  }
  isValid(): boolean {
    return true;
  }
}

export class ChangeStickerAction implements ActionInterface {
  oldX: number;
  oldY: number;
  oldWidth: number;
  oldHeight: number;
  oldRotation: number;

  newX: number;
  newY: number;
  newWidth: number;
  newHeight: number;
  newRotation: number;

  sticker: Sticker;

  constructor(sticker: Sticker) {
    this.sticker = sticker;

    this.oldX = sticker.x;
    this.oldY = sticker.y;
    this.oldWidth = sticker.width;
    this.oldHeight = sticker.height;
    this.oldRotation = sticker.rotation;

    this.newX = this.sticker.x;
    this.newY = this.sticker.y;
    this.newWidth = this.sticker.width;
    this.newHeight = this.sticker.height;
    this.newRotation = this.sticker.rotation;
  }
  undo(store: PixelArtPageStore): void {
    this.sticker.set(this.oldX, this.oldY, this.oldWidth, this.oldHeight, this.oldRotation);
    store.refreshStickers();
  }
  redo(store: PixelArtPageStore): void {
    this.sticker.set(this.newX, this.newY, this.newWidth, this.newHeight, this.newRotation);
    store.refreshStickers();
  }
  update(): void {
    this.newX = this.sticker.x;
    this.newY = this.sticker.y;
    this.newWidth = this.sticker.width;
    this.newHeight = this.sticker.height;
    this.newRotation = this.sticker.rotation;
  }
  isValid(): boolean {
    return true;
  }
}

export class IdenticonAction implements ActionInterface {
  canvasPixels: string[];

  constructor(store: PixelArtPageStore) {
    this.canvasPixels = [...store.pixelsCanvas.canvasPixels];
  }
  do(store: PixelArtPageStore) {
    const colors = store.palette;
    let text = store.selectedAddress;
    let hashedText = "";
    for (let cn = 0; cn < 128; ++cn) {
      text = sha512(text);
      hashedText += text;
    }
    for (let cy = 0; cy < store.pixelsCanvas.canvasSize; ++cy) {
      for (let cx = 0; cx < store.pixelsCanvas.canvasSize; ++cx) {
        let i = cx + cy * store.pixelsCanvas.canvasSize;
        i %= hashedText.length;
        let code = hashedText.charCodeAt(i) - 32;
        store.pixelsCanvas.setPixelColor(cx, cy, colors[code % colors.length].hex);
      }
    }
  }
  undo(store: PixelArtPageStore): void {
    store.pixelsCanvas.canvasPixels = [...this.canvasPixels];
    store.pixelsCanvas.updateCanvas();
  }
  redo(store: PixelArtPageStore): void {
    this.do(store);
  }
  isValid(): boolean {
    return true;
  }
}

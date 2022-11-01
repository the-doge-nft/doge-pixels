import { Sticker } from "./PixelArtPage.store";

export const TRANSPARENT_PIXEL = "#0000";

export enum CanvasSize {
  S = 16,
  M = 32,
  L = 64,
  XL = 128,
}

export interface CanvasSizeInfo {
  id: string;
  name: string;
  value: CanvasSize;
}

export const CANVAS_SIZES = [
  { id: "S", name: "S", value: CanvasSize.S },
  { id: "M", name: "M", value: CanvasSize.M },
  { id: "L", name: "L", value: CanvasSize.L },
  { id: "XL", name: "XL", value: CanvasSize.XL },
];

export class PixelArtCanvas {
  canvas?: HTMLCanvasElement;
  canvasPixels: string[];
  canvasSize: number;

  constructor(canvasSize: CanvasSize) {
    this.canvasSize = canvasSize;
    this.canvasPixels = [];
    for (let cn = 0; cn < this.canvasSize * this.canvasSize; ++cn) {
      this.canvasPixels.push(TRANSPARENT_PIXEL);
    }
  }

  resize(canvasSize: CanvasSize) {
    this.canvasSize = canvasSize;
    this.canvasPixels = [];
    for (let cn = 0; cn < this.canvasSize * this.canvasSize; ++cn) {
      this.canvasPixels.push(TRANSPARENT_PIXEL);
    }
    this.updateCanvas();
  }

  getSizeInfo() {
    const entry = CANVAS_SIZES.find(entry => {
      return entry.value === this.canvasSize;
    });
    return entry ? entry : CANVAS_SIZES[0];
  }

  saveInfo() {
    return {
      size: this.canvasSize,
      pixels: [...this.canvasPixels],
    };
  }

  loadInfo(info: any) {
    //console.log(info);
    this.resize(info.size);
    if (info.pixels && this.canvasPixels.length === info.pixels.length) {
      for (let cn = 0; cn < info.pixels.length; ++cn) {
        this.canvasPixels[cn] = info.pixels[cn];
      }
    }
  }

  updateCanvas() {
    this.updateCanvasEx(this.canvas);
  }

  updateCanvasEx(canvas: HTMLCanvasElement) {
    if (!canvas) return;

    let ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellSize = canvas.width / this.canvasSize;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let cy = 0; cy < this.canvasSize; ++cy) {
      for (let cx = 0; cx < this.canvasSize; ++cx) {
        ctx.fillStyle = this.canvasPixels[cx + cy * this.canvasSize];
        ctx.fillRect(Math.floor(cx * cellSize), Math.floor(cy * cellSize), Math.ceil(cellSize), Math.ceil(cellSize));
      }
    }
    ctx.restore();
  }

  drawStickers(stickers: Sticker[]) {
    //console.log(stickers);

    if (!this.canvas) return;

    let ctx = this.canvas.getContext("2d");
    if (!ctx) return;
    for (const sticker of stickers) {
      if (sticker.image) {
        ctx.save();
        const b = (sticker.rotation / 180) * Math.PI;
        let rotX =
          (Math.cos(b) * sticker.width * this.canvas.width) / 2 -
          (Math.sin(b) * sticker.height * this.canvas.height) / 2;
        let rotY =
          (Math.sin(b) * sticker.width * this.canvas.width) / 2 +
          (Math.cos(b) * sticker.height * this.canvas.height) / 2;
        ctx.rotate(b);
        let transform = ctx.getTransform();
        transform.e = sticker.x * this.canvas.width - rotX + (sticker.width * this.canvas.width) / 2;
        transform.f = sticker.y * this.canvas.height - rotY + (sticker.height * this.canvas.height) / 2;
        ctx.setTransform(transform);
        ctx.drawImage(sticker.image, 0, 0, sticker.width * this.canvas.width, sticker.height * this.canvas.height);
        ctx.restore();
      }
    }
  }

  drawPixel(x: number, y: number, color: string) {
    if (!this.canvas) return;

    let ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const cellSize = this.canvas.width / this.canvasSize;

    if (color === TRANSPARENT_PIXEL) {
      ctx.clearRect(Math.floor(x * cellSize), Math.floor(y * cellSize), Math.ceil(cellSize), Math.ceil(cellSize));
      //ctx.clearRect(x * cellSize, y * cellSize, cellSize, cellSize);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(Math.floor(x * cellSize), Math.floor(y * cellSize), Math.ceil(cellSize), Math.ceil(cellSize));
      //ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  setPixelColor(x: number, y: number, color: string) {
    this.canvasPixels[x + y * this.canvasSize] = color;
    this.drawPixel(x, y, color);
  }

  getPixelColor(x: number, y: number): string {
    return this.canvasPixels[x + y * this.canvasSize];
  }

  isSamePixel(x: number, y: number, color: string): boolean {
    return this.canvasPixels[x + y * this.canvasSize] === color;
  }
}

import { PixelArtCanvas, TRANSPARENT_PIXEL } from "./PixelArtCanvas";

export interface ActionInterface {
    undo(pixelsCanvas: PixelArtCanvas): void;
    redo(pixelsCanvas: PixelArtCanvas): void;
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

    update(pixelsCanvas: PixelArtCanvas, x: number, y: number): void {
        const previousColor = pixelsCanvas.getPixelColor(x, y);
        if (previousColor !== this.color) {
            this.pixels.push({
                x,
                y,
                color: previousColor,
            })
            pixelsCanvas.setPixelColor(x, y, this.color);
        }
    }

    redo(pixelsCanvas: PixelArtCanvas) {
        for (const pixelInfo of this.pixels) {
            pixelsCanvas.setPixelColor(pixelInfo.x, pixelInfo.y, this.color);
        }
    }

    undo(pixelsCanvas: PixelArtCanvas) {
        for (const pixelInfo of this.pixels) {
            pixelsCanvas.setPixelColor(pixelInfo.x, pixelInfo.y, pixelInfo.color);
        }
    }

    isValid() {
        return this.pixels.length > 0;
    }
}

export class ClearAction extends PixelAction {
    constructor(pixelsCanvas: PixelArtCanvas) {
        super(TRANSPARENT_PIXEL);

        for(let cy = 0; cy < pixelsCanvas.canvasSize; ++cy) {
            for(let cx = 0; cx < pixelsCanvas.canvasSize; ++cx) {
                this.update(pixelsCanvas, cx, cy);
            }
        }
    }
}
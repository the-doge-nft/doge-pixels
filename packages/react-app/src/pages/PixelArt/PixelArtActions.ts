import PixelArtPageStore, { TRANSPARENT_PIXEL } from "./PixelArtPage.store";

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
        const previousColor = store.getPixelColor(x, y);
        if (previousColor !== this.color) {
            this.pixels.push({
                x,
                y,
                color: previousColor,
            })
            store.setPixelColor(x, y, this.color);
        }
    }

    redo(store: PixelArtPageStore) {
        for (const pixelInfo of this.pixels) {
            store.setPixelColor(pixelInfo.x, pixelInfo.y, this.color);
        }
    }

    undo(store: PixelArtPageStore) {
        for (const pixelInfo of this.pixels) {
            store.setPixelColor(pixelInfo.x, pixelInfo.y, pixelInfo.color);
        }
    }

    isValid() {
        return this.pixels.length > 0;
    }
}
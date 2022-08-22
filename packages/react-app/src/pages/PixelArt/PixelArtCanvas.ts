export const TRANSPARENT_PIXEL = '#0000';

export enum CanvasSize {
    S = 16,
    M = 32,
    L = 64,
    XL = 128,
}

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


    updateCanvas() {
        if (!this.canvas) return;

        let ctx = this.canvas.getContext('2d');
        if (!ctx) return;

        const cellSize = this.canvas.width / this.canvasSize;

        ctx.save();
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let cy = 0; cy < this.canvasSize; ++cy) {
            for (let cx = 0; cx < this.canvasSize; ++cx) {
                ctx.fillStyle = this.canvasPixels[cx + cy * this.canvasSize];
                ctx.fillRect(cx * cellSize, cy * cellSize, cellSize, cellSize);
            }
        }
        ctx.restore();
    }

    drawPixel(x: number, y: number, color: string) {
        if (!this.canvas) return;

        let ctx = this.canvas.getContext('2d');
        if (!ctx) return;

        const cellSize = this.canvas.width / this.canvasSize;

        if (color === TRANSPARENT_PIXEL) {
            ctx.clearRect(x * cellSize, y * cellSize, cellSize, cellSize);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);    
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
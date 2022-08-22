import { ethers } from "ethers";
import { action, computed, makeObservable, observable } from "mobx";
import { EmptyClass } from "../../helpers/mixins";
import { ObjectKeys } from "../../helpers/objects";
import { Reactionable } from "../../services/mixins/reactionable";
import AppStore from "../../store/App.store";
import { ActionInterface } from "./PixelArtActions";

export const TRANSPARENT_PIXEL = '#0000';

export enum PixelArtTool {
    pen,
    erase,
}

class PixelArtPageStore extends Reactionable(EmptyClass) {
    canvas?: HTMLCanvasElement;

    @observable
    selectedAddress: string;

    @observable
    selectedBrushPixelIndex: number;

    tools: any[];

    @observable
    selectedToolIndex: number;

    canvasPixels: string[];
    canvasSize = 32;

    @observable
    undoActions: ActionInterface[];
    @observable
    redoActions: ActionInterface[];

    constructor() {
        super()
        makeObservable(this)

        this.selectedAddress = '0xd801d86C10e2185a8FCBccFB7D7baF0A6C5B6BD5';

        this.canvasPixels = [];
        for (let cn = 0; cn < this.canvasSize * this.canvasSize; ++cn) {
            this.canvasPixels.push(TRANSPARENT_PIXEL);
        }

        this.selectedBrushPixelIndex = 0;

        this.selectedToolIndex = 0;
        this.tools = [
            {
                id: PixelArtTool.pen,
                icon: 'toolPen',
            },
            {
                id: PixelArtTool.erase,
                icon: 'toolErase',
            },
        ];

        this.undoActions = [];
        this.redoActions = [];
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
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

    getPFP() {
        
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

    pushAction(action: ActionInterface) {
        this.undoActions.push(action);
        this.redoActions = [];
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
    get topDogs(): { address: string, puppers: number[], ens?: string }[] {
        const tds = ObjectKeys(AppStore.web3.addressToPuppers).map((key, index, arr) => (
            { address: key, puppers: AppStore.web3.addressToPuppers![key].tokenIDs, ens: AppStore.web3.addressToPuppers![key].ens }
        ))
        return tds
            .filter(dog => dog.address !== ethers.constants.AddressZero)
            .filter(dog => dog.puppers.length > 0)
            .sort((a, b) => {
                if (a.puppers.length > b.puppers.length) {
                    return -1
                } else if (a.puppers.length < b.puppers.length) {
                    return 1
                } else {
                    return 0
                }
            })
    }
    @computed
    get selectedDogs() {
        return this.topDogs.filter(dog => dog.address === this.selectedAddress)[0]
    }

    @computed
    get palette() {
        let data = this.selectedDogs?.puppers.map(px => {
            return AppStore.web3.pupperToHexLocal(px);
        })
        .sort((a, b) => {
            return a.localeCompare(b);
        });
        data = data?.filter(function(item, pos) {
            return data.indexOf(item) === pos;
        })

        return data;
    }

}

export default PixelArtPageStore;

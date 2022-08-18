import { ethers } from "ethers";
import { action, computed, makeObservable, observable } from "mobx";
import { EmptyClass } from "../../helpers/mixins";
import { ObjectKeys } from "../../helpers/objects";
import { Reactionable } from "../../services/mixins/reactionable";
import AppStore from "../../store/App.store";

export enum PixelArtTool {
    pen,
    erase,
}

export interface ActionInterface {
    do(store: PixelArtPageStore): void,
    undo(store: PixelArtPageStore): void,
}

export class PenAction implements ActionInterface {
    x: number;
    y: number;
    color: string;
    storedColor: string;

    constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.storedColor = '';
    }
    do(store: PixelArtPageStore) {
        this.storedColor = store.canvasPixels[this.x + this.y * store.canvasSize];
        store.canvasPixels[this.x + this.y * store.canvasSize] = this.color;
    }
    undo(store: PixelArtPageStore) {
        store.canvasPixels[this.x + this.y * store.canvasSize] = this.storedColor;
    }
}

export class EraseAction implements ActionInterface {
    x: number;
    y: number;
    storedColor: string;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.storedColor = '';
    }

    do(store: PixelArtPageStore) {
        this.storedColor = store.canvasPixels[this.x + this.y * store.canvasSize];
        store.canvasPixels[this.x + this.y * store.canvasSize] = '#00000000';
    }
    undo(store: PixelArtPageStore) {
        store.canvasPixels[this.x + this.y * store.canvasSize] = this.storedColor;
    }
}

class PixelArtPageStore extends Reactionable(EmptyClass) {
    @observable
    selectedAddress: string;

    @observable
    brushPixels: any[];

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

    @observable
    tick: number = 0;

    constructor() {
        super()
        makeObservable(this)

        this.selectedAddress = '0xd801d86C10e2185a8FCBccFB7D7baF0A6C5B6BD5';

        this.canvasPixels = [];
        for (let cn = 0; cn < this.canvasSize * this.canvasSize; ++cn) {
            this.canvasPixels.push('#00000000');
        }

        this.selectedBrushPixelIndex = 0;
        this.brushPixels = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#ffffff'];

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

    setPixelColor(x: number, y: number, color: string) {
        this.canvasPixels[x + y * this.canvasSize] = color;
    }

    getPixelColor(x: number, y: number): string {
        return this.canvasPixels[x + y * this.canvasSize];
    }

    @action
    doAction(action: ActionInterface) {
        action.do(this);
        this.undoActions.push(action);
        this.redoActions = [];
        ++this.tick;
    }
    @action
    undoAction() {
        if (this.undoActions.length) {
            const action: ActionInterface | undefined = this.undoActions.pop();
            if (action) {
                console.log('undo', action);
                action.undo(this);
                this.redoActions.push(action);
            }
        }
        ++this.tick;
    }
    @action
    redoAction() {
        if (this.redoActions.length) {
            const action: ActionInterface | undefined = this.redoActions.pop();
            if (action) {
                console.log('redo', action);
                action.do(this);
                this.undoActions.push(action);
            }
        }
        ++this.tick;
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
        return this.selectedDogs?.puppers.map(px => {
            return AppStore.web3.pupperToHexLocal(px);
        })
        .sort((a, b) => {
            return a.localeCompare(b);
        });
    }

}

export default PixelArtPageStore;

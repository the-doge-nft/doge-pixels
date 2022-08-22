import { ethers } from "ethers";
import { action, computed, makeObservable, observable } from "mobx";
import { EmptyClass } from "../../helpers/mixins";
import { ObjectKeys } from "../../helpers/objects";
import { Reactionable } from "../../services/mixins/reactionable";
import AppStore from "../../store/App.store";
import { ActionInterface } from "./PixelArtActions";
import { CanvasSize, PixelArtCanvas } from "./PixelArtCanvas";

const MAX_ACTIONS_CN = 50;

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

    pixelsCanvas: PixelArtCanvas;

    constructor() {
        super()
        makeObservable(this)

        this.pixelsCanvas = new PixelArtCanvas(CanvasSize.M);

        this.selectedAddress = '0xd801d86C10e2185a8FCBccFB7D7baF0A6C5B6BD5';

        this.selectedBrushPixelIndex = 0;

        this.selectedToolIndex = 0;

        this.undoActions = [];
        this.redoActions = [];
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.pixelsCanvas.canvas = canvas;
        this.pixelsCanvas.updateCanvas();
    }


    @action
    pushAction(action: ActionInterface) {
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
                action.undo(this.pixelsCanvas);
                this.redoActions.push(action);
            }
        }
    }
    @action
    redoAction() {
        if (this.redoActions.length) {
            const action: ActionInterface | undefined = this.redoActions.pop();
            if (action) {
                action.redo(this.pixelsCanvas);
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

import {Reactionable} from "../services/mixins/reactionable";
import {EmptyClass} from "../helpers/mixins";
import {makeObservable, observable} from "mobx";
import AppStore from "../store/App.store";
import {Http} from "../services";
import {sleep} from "../helpers/sleep";
import jsonify from "../helpers/jsonify";

class DiffPixelsStore extends Reactionable(EmptyClass) {

    @observable
    initialPixels: number[] = []

    @observable
    diffPixels: number[] = []

    @observable
    _tick = 0

    constructor() {
        super();
        makeObservable(this)
    }

    private start() {
        this.initialPixels = AppStore.web3.puppersOwned
        this.incrementTick()
    }

    listenForDiffPixels(onDiffPixels: (pixels: number[]) => void) {
        this.react(() => this._tick, async () => {
            const { data } = await Http.get('/v1/config')
            const newPixels: number[] = data[AppStore.web3.address]?.tokenIds
            if (newPixels.length === this.initialPixels.length) {
                await sleep(2000)
                this.incrementTick()
            } else {
                console.log('debug:: old', jsonify(this.initialPixels))
                console.log('debug:: new', jsonify(newPixels))

                const mintedPixels = newPixels.filter(pixel => {
                    if (!this.initialPixels.includes(pixel)) {
                        return 1
                    }
                    return 0
                })

                const burnedPixels = this.initialPixels.filter(pixel => {
                    if (!newPixels.includes(pixel)) {
                        return 1
                    }
                    return 0
                })
                this.diffPixels = mintedPixels.concat(burnedPixels)
                console.log('debug:: found diff pixels')
                console.log('debug:: new pixels detected')
                console.log('debug:: new px found', jsonify(this.diffPixels))
                return onDiffPixels(this.diffPixels)
            }
        })
        this.start()
    }

    incrementTick() {
        this._tick += 1
    }

    destroy() {
        this.disposeReactions()
    }

}

export default DiffPixelsStore

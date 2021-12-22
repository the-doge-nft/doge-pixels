import {makeObservable, observable} from "mobx";
import Web3Store from "./web3.store";
import RWDStore from "./RWD.store";

class _AppStore {

    @observable
    web3: Web3Store

    @observable
    rwd: RWDStore

    constructor() {
        makeObservable(this)
        this.web3 = new Web3Store()
        this.rwd = new RWDStore()
    }

    init() {
        this.rwd.init()
        this.web3.init()
    }
}

const AppStore = new _AppStore()

export default AppStore;

import {action, makeObservable, observable} from "mobx";
import Web3Store from "./web3.store";

class _AppStore {

    @observable
    web3: Web3Store

    constructor() {
        makeObservable(this)
        this.web3 = new Web3Store()
    }

    init() {
        // this.web3.init()
        console.log("debug:: initializing AppStore")
    }
}

const AppStore = new _AppStore()

export default AppStore;

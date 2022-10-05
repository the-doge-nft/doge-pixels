import {computed, makeObservable, observable} from "mobx";
import {web3Modal} from "../services/web3Modal";
import {BigNumber, Contract, ethers} from "ethers";
import {showErrorToast} from "../DSL/Toast/Toast";
import deployedContracts from "../contracts/hardhat_contracts.json"
import {Signer} from "@ethersproject/abstract-signer";
import {Provider} from "@ethersproject/abstract-provider";
import {isDevModeEnabled, isProduction, isStaging} from "../environment/helpers";
import {DOG20, PX} from "../../../hardhat/types";
import KobosuJson from "../images/kobosu.json"
import {Http} from "../services";
import Web3providerStore, {EthersContractError, Web3ProviderConnectionError} from "./web3provider.store";
import * as Sentry from "@sentry/react";
import {ContractInterface} from "@ethersproject/contracts/src.ts/index";
import CowStore from "./cow.store";
import {ObjectKeys} from "../helpers/objects";
import AppStore from "./App.store";
import {PixelOwnerInfo} from "../pages/Leaderbork/Leaderbork.store";
import {Reactionable} from "../services/mixins/reactionable";

interface AddressToPuppers {
    [k: string]: {
        tokenIds: number[],
        ens: string | null
    }
}

class Web3Store extends Reactionable(Web3providerStore) {
    D20_PRECISION = BigNumber.from("1000000000000000000")
    DOG_TO_PIXEL_SATOSHIS = BigNumber.from("55239898990000000000000")
    PIXEL_TO_ID_OFFSET = 1000000
    WIDTH = 640
    HEIGHT = 480
    DOG_BURN_FEES_PERCENT = 1

    @observable
    dogBalance: BigNumber | null = null

    @observable
    pupperBalance?: number

    @observable
    dogContract?: DOG20

    @observable
    pxContract?: PX

    @observable
    addressToPuppers?: AddressToPuppers

    @observable
    pxContractAddress: string

    @observable
    dogContractAddress: string

    @observable
    cowStore: CowStore

    @observable
    usdPerPixel?: number

    constructor() {
        super()
        makeObservable(this)
        this.addressToPuppers = {}
        this.cowStore = new CowStore()

        if (isDevModeEnabled() || isStaging()) {
            this.pxContractAddress = deployedContracts["4"]["rinkeby"]["contracts"]["PX"]["address"]
            this.dogContractAddress = deployedContracts["4"]["rinkeby"]["contracts"]["DOG20"]["address"]

            // todo -- remove this
            // this.pxContractAddress = deployedContracts["1"]["mainnet"]["contracts"]["PX"]["address"]
            // this.dogContractAddress = deployedContracts["1"]["mainnet"]["contracts"]["DOG20"]["address"]
        } else if (isProduction()) {
            this.pxContractAddress = deployedContracts["1"]["mainnet"]["contracts"]["PX"]["address"]
            this.dogContractAddress = deployedContracts["1"]["mainnet"]["contracts"]["DOG20"]["address"]
        } else {
            throw Error("Unknown environment")
        }
    }

    init() {
        if (web3Modal.cachedProvider && !this.web3Provider?.connection) {
            this.connect()
        }
        this.getPixelOwnershipMap()
        this.getShibaDimensions()
        // this.getUSDPerPixel()
    }

    async connect() {
        try {
            await super.connect()
            this.connectToContracts(this.signer!)
            await this.errorGuardContracts()
            this.cowStore.connect(this.signer!)
            this.refreshDogBalance()
            this.refreshPupperBalance()
        } catch (e) {
            if (e instanceof Web3ProviderConnectionError) {
                // pass
            } else {
                console.error(e)
                Sentry.captureException(e)
                showErrorToast("Error connecting")
            }
        }
    }

    connectToContracts(signerOrProvider?: Signer | Provider) {
        let pxABI: ContractInterface
        let dogABI: ContractInterface

        if (isDevModeEnabled() || isStaging()) {
            pxABI = deployedContracts["4"]["rinkeby"]["contracts"]["PX"].abi
            dogABI = deployedContracts["4"]["rinkeby"]["contracts"]["DOG20"].abi
        } else if (isProduction()) {
            pxABI = deployedContracts["1"]["mainnet"]["contracts"]["PX"].abi
            dogABI = deployedContracts["1"]["mainnet"]["contracts"]["DOG20"].abi
        } else {
            throw Error("Uknown environment found when connecting to contracts")
        }

        const px = new Contract(
            this.pxContractAddress,
            pxABI,
            signerOrProvider
        ) as unknown
        this.pxContract = px as PX

        const dog = new Contract(
            this.dogContractAddress,
            dogABI,
            signerOrProvider
        ) as unknown
        this.dogContract = dog as DOG20

        //@ts-ignore
        window.__PX__ = px;
        //@ts-ignore
        window.__DOG20__ = dog;
        this.debugContractAddresses()
    }

    async debugContractAddresses() {
        const res = await Http.get("/v1/contract/addresses")
        const {dog: dogAddress, pixel: pixelAddress} = res.data

        if (dogAddress !== this.dogContractAddress) {
            throw Error(`Frontend (${this.dogContractAddress}) and API (${dogAddress}) DOG addresses do not match`)
        }

        if (pixelAddress !== this.pxContractAddress) {
            throw Error(`Frontend (${this.pxContractAddress}) and API (${pixelAddress}) PIXEL addresses do not match`)
        }

        console.log(`api connected to pixel contract: ${pixelAddress}`)
        console.log(`frontend connected to pixel contract: ${this.pxContractAddress}`)

        console.log(`api connected to DOG contract: ${dogAddress}`)
        console.log(`frontend connected to DOG contract: ${this.dogContractAddress}`)
    }

    async errorGuardContracts() {
        const nonContractCode = "0x"
        const pxCode = await this.web3Provider.getCode(this.pxContractAddress)
        if (pxCode === nonContractCode) {
            await this.disconnect()
            throw Error(`PX address is not a contract, please make sure it is deployed & you are on the correct network. Got ${pxCode} ${this.network?.name} ${this.pxContractAddress}`)
        }
        const dogCode = await this.web3Provider.getCode(this.dogContractAddress)
        if (dogCode === nonContractCode) {
            await this.disconnect()
            throw Error("DOG20 address is not a contract, please make sure it is deployed & you are on the correct network.")
        }
    }

    getPixelOwnershipMap() {
        return Http.get("/v1/config").then(({data}) => this.addressToPuppers = data)
    }

    refreshPixelOwnershipMap() {
        return Http.get("/v1/config/refresh").then(({data}) => this.addressToPuppers = data)
    }

    getShibaDimensions() {
        return Http.get("/v1/px/dimensions").then(({data}) => {
            this.WIDTH = data.width;
            this.HEIGHT = data.height;
        })
    }

    @computed
    get puppersOwned() {
        let myPuppers: number[] = []
        if (this.address && this.address in this.addressToPuppers!) {
            myPuppers = this.addressToPuppers![this.address].tokenIds
        }
        return myPuppers
    }

    async refreshDogBalance() {
        try {
            this.dogBalance = await this.getDogBalance()
        } catch (e) {
            const {message} = e as EthersContractError
            this.dogBalance = BigNumber.from(0)
            showErrorToast(message)
        }
    }

    async refreshPupperBalance() {
        try {
            this.pupperBalance = await this.getPupperBalance()
        } catch (e) {
            const {message} = e as EthersContractError
            this.pupperBalance = 0
            showErrorToast(message)
        }
    }

    async getDogBalance() {
        const balance = await this.dogContract!.balanceOf(this.address!)
        return balance
    }

    async getPupperBalance() {
        const res = await Http.get(`/v1/px/balance/${this.address}`)
        return res.data.balance
    }

    async getPxOwnerByTokenId(tokenId: number) {
        const res = await Http.get(`/v1/px/owner/${tokenId}`)
        return res.data.address
    }

    async approvePxSpendDog(amount: BigNumber) {
        return this.dogContract!.approve(this.pxContractAddress, amount)
    }

    async getPxDogSpendAllowance() {
        return this.dogContract!.allowance(this.address!, this.pxContractAddress)
    }

    async getDogToAccount() {
        const freePixelsInDOG = 10
        //@ts-ignore
        return this.dogContract!.initMock([this.address!], this.DOG_TO_PIXEL_SATOSHIS.mul(freePixelsInDOG))
    }

    async getDogLocked() {
        const res = await Http.get("/v1/dog/locked")
        return res.data.balance
    }

    mintPuppers(pixel_amount: number, forcedGasLimit?: BigNumber) {
        let overrides: any = {}
        if (forcedGasLimit) {
            overrides = {gasLimit: forcedGasLimit}
        }
        return this.pxContract!.mintPuppers(pixel_amount, overrides)
    }

    pupperToPixelCoords(pupper: number) {
        return this.pxContract!.pupperToPixelCoords(pupper)
    }

    burnPupper(pupper: number) {
        return this.pxContract!.burnPuppers([pupper])
    }

    burnPuppers(puppers: number[]) {
        return this.pxContract!.burnPuppers(puppers)
    }

    pupperToIndexLocal(pupper: number) {
        return pupper - this.PIXEL_TO_ID_OFFSET
    }

    pupperToPixelCoordsLocal(pupper: number) {
        const index = this.pupperToIndexLocal(pupper)
        return [index % this.WIDTH, Math.floor(index / this.WIDTH)]
    }

    pupperToHexLocal(pupper: number) {
        const [x, y] = this.pupperToPixelCoordsLocal(pupper)
        return KobosuJson[y][x]
    }

    coordinateToPupperLocal(x: number, y: number) {
        return ((this.WIDTH * y) + x) + this.PIXEL_TO_ID_OFFSET
    }

    isPixelIDValid(id: number) {
        const max = (this.WIDTH * this.HEIGHT) + this.PIXEL_TO_ID_OFFSET - 1
        const min = this.PIXEL_TO_ID_OFFSET
        if (id < min || id > max) {
            return false
        }
        return true
    }

    getUSDPerPixel() {
        return Http.get('/v1/px/price').then(({data}) => {
            this.usdPerPixel = data.price
        })
    }

    @computed
    get sortedPixelOwners(): PixelOwnerInfo[] {
        const tds = ObjectKeys(this.addressToPuppers).map((key, index, arr) => (
            {address: key, pixels: this.addressToPuppers![key].tokenIds, ens: this.addressToPuppers![key].ens}
        ))
        return tds
            .filter(dog => dog.address !== ethers.constants.AddressZero)
            .filter(dog => dog.pixels.length > 0)
            .sort((a, b) => {
                if (a.pixels.length > b.pixels.length) {
                    return -1
                } else if (a.pixels.length < b.pixels.length) {
                    return 1
                } else {
                    return 0
                }
            })
    }
}


export default Web3Store

import { Chain } from "@rainbow-me/rainbowkit";
import * as Sentry from "@sentry/react";
import { Provider, Signer } from "@wagmi/core";
import { BigNumber, Contract, ethers } from "ethers";
import { computed, makeObservable, observable } from "mobx";
import { DOG20, PX } from "../../../hardhat/types";
import deployedContracts from "../contracts/hardhat_contracts.json";
import { showErrorToast } from "../DSL/Toast/Toast";
import env from "../environment";
import { ObjectKeys } from "../helpers/objects";
import { abbreviate } from "../helpers/strings";
import KobosuJson from "../images/kobosu.json";
import { PixelOwnerInfo } from "../pages/Leaderbork/Leaderbork.store";
import { Http } from "../services";
import LocalStorage from "../services/local-storage";
import { Reactionable } from "../services/mixins/reactionable";
import CowStore from "./cow.store";
import Web3providerStore, { EthersContractError } from "./web3provider.store";

const VIEWED_PIXELS_LS_KEY = "viewed_pixels_by_id";

interface AddressToPuppers {
  [k: string]: {
    tokenIds: number[];
    ens: string | null;
    ud: string | null;
  };
}

class Web3Store extends Reactionable(Web3providerStore) {
  D20_PRECISION = BigNumber.from("1000000000000000000");
  DOG_TO_PIXEL_SATOSHIS = BigNumber.from("55239898990000000000000");
  PIXEL_TO_ID_OFFSET = 1000000;
  WIDTH = 640;
  HEIGHT = 480;
  DOG_BURN_FEES_PERCENT = 1;
  targetChainId = env.app.targetChainId;
  targetNetworkName = env.app.targetNetworkName;

  @observable
  dogBalance: BigNumber | null = null;

  @observable
  pupperBalance?: number;

  @observable
  dogContract?: DOG20;

  @observable
  pxContract?: PX;

  @observable
  addressToPuppers?: AddressToPuppers;

  @observable
  pxContractAddress: string;

  @observable
  dogContractAddress: string;

  @observable
  cowStore: CowStore;

  @observable
  usdPerPixel?: number;

  constructor() {
    super();
    makeObservable(this);
    this.addressToPuppers = {};
    this.cowStore = new CowStore();

    this.pxContractAddress =
      deployedContracts[this.targetChainId.toString()][this.targetNetworkName]["contracts"]["PX"]["address"];
    this.dogContractAddress =
      deployedContracts[this.targetChainId.toString()][this.targetNetworkName]["contracts"]["DOG20"]["address"];
  }

  init() {
    this.getPixelOwnershipMap();
    this.getShibaDimensions();
    this.getUSDPerPixel();
  }

  async connect(signer: Signer, network: Chain, provider: Provider) {
    try {
      await super.connect(signer, network, provider);
      this.connectToContracts(this.signer!);
      await this.debugContractAddresses();
      await this.errorGuardContracts();
      this.cowStore.connect(this.signer!);
      this.refreshDogBalance();
      this.refreshPupperBalance();
    } catch (e) {
      console.error(e);
      Sentry.captureException(e);
      showErrorToast("Error connecting");
    }
  }

  connectToContracts(signer: Signer) {
    const px = new Contract(
      this.pxContractAddress,
      deployedContracts[this.targetChainId.toString()][this.targetNetworkName]["contracts"]["PX"].abi,
      signer,
    ) as unknown;
    this.pxContract = px as PX;

    const dog = new Contract(
      this.dogContractAddress,
      deployedContracts[this.targetChainId.toString()][this.targetNetworkName]["contracts"]["DOG20"].abi,
      signer,
    ) as unknown;
    this.dogContract = dog as DOG20;

    //@ts-ignore
    window.__PX__ = px;
    //@ts-ignore
    window.__DOG20__ = dog;
  }

  async debugContractAddresses() {
    const res = await Http.get("/v1/contract/addresses");
    const { dog: dogAddress, pixel: pixelAddress } = res.data;

    if (dogAddress !== this.dogContractAddress) {
      throw Error(`Frontend (${this.dogContractAddress}) and API (${dogAddress}) DOG addresses do not match`);
    }

    if (pixelAddress !== this.pxContractAddress) {
      throw Error(`Frontend (${this.pxContractAddress}) and API (${pixelAddress}) PIXEL addresses do not match`);
    }

    console.log(`api connected to pixel contract: ${pixelAddress}`);
    console.log(`frontend connected to pixel contract: ${this.pxContractAddress}`);

    console.log(`api connected to DOG contract: ${dogAddress}`);
    console.log(`frontend connected to DOG contract: ${this.dogContractAddress}`);
  }

  async errorGuardContracts() {
    const nonContractCode = "0x";
    const pxCode = await this.provider.getCode(this.pxContractAddress);
    if (pxCode === nonContractCode) {
      await this.disconnect();
      throw Error(
        `PX address is not a contract, please make sure it is deployed & you are on the correct network. Got ${pxCode} ${this.network?.name} ${this.pxContractAddress}`,
      );
    }
    const dogCode = await this.provider.getCode(this.dogContractAddress);
    if (dogCode === nonContractCode) {
      await this.disconnect();
      throw Error("DOG20 address is not a contract, please make sure it is deployed & you are on the correct network.");
    }
  }

  getPixelOwnershipMap() {
    return Http.get("/v1/config").then(({ data }) => (this.addressToPuppers = data));
  }

  refreshPixelOwnershipMap() {
    return Http.get("/v1/config/refresh").then(({ data }) => (this.addressToPuppers = data));
  }

  getShibaDimensions() {
    return Http.get("/v1/px/dimensions").then(({ data }) => {
      this.WIDTH = data.width;
      this.HEIGHT = data.height;
    });
  }

  @computed
  get puppersOwned() {
    let myPuppers: number[] = [];
    if (this.address && this.address in this.addressToPuppers!) {
      myPuppers = this.addressToPuppers![this.address].tokenIds;
    }
    return myPuppers;
  }

  async refreshDogBalance() {
    try {
      this.dogBalance = await this.getDogBalance();
    } catch (e) {
      const { message } = e as EthersContractError;
      this.dogBalance = BigNumber.from(0);
      showErrorToast(message);
    }
  }

  async refreshPupperBalance() {
    try {
      this.pupperBalance = await this.getPupperBalance();
    } catch (e) {
      const { message } = e as EthersContractError;
      this.pupperBalance = 0;
      showErrorToast(message);
    }
  }

  async getDogBalance() {
    const balance = await this.dogContract!.balanceOf(this.address!);
    return balance;
  }

  async getPupperBalance() {
    const res = await Http.get(`/v1/px/balance/${this.address}`);
    return res.data.balance;
  }

  async getPxOwnerByTokenId(tokenId: number) {
    const res = await Http.get(`/v1/px/owner/${tokenId}`);
    return res.data.address;
  }

  async approvePxSpendDog(amount: BigNumber) {
    return this.dogContract!.approve(this.pxContractAddress, amount);
  }

  async getPxDogSpendAllowance() {
    return this.dogContract!.allowance(this.address!, this.pxContractAddress);
  }

  async getDogToAccount() {
    const freePixelsInDOG = 50;
    //@ts-ignore
    return this.dogContract!.initMock([this.address!], this.DOG_TO_PIXEL_SATOSHIS.mul(freePixelsInDOG));
  }

  async getDogLocked() {
    const res = await Http.get("/v1/dog/locked");
    return res.data.balance;
  }

  mintPuppers(pixel_amount: number, forcedGasLimit?: BigNumber) {
    let overrides: any = {};
    if (forcedGasLimit) {
      overrides = { gasLimit: forcedGasLimit };
    }
    return this.pxContract!.mintPuppers(pixel_amount, overrides);
  }

  pupperToPixelCoords(pupper: number) {
    return this.pxContract!.pupperToPixelCoords(pupper);
  }

  burnPupper(pupper: number) {
    return this.pxContract!.burnPuppers([pupper]);
  }

  burnPuppers(puppers: number[]) {
    return this.pxContract!.burnPuppers(puppers);
  }

  pupperToIndexLocal(pupper: number) {
    return pupper - this.PIXEL_TO_ID_OFFSET;
  }

  pupperToPixelCoordsLocal(pupper: number) {
    const index = this.pupperToIndexLocal(pupper);
    return [index % this.WIDTH, Math.floor(index / this.WIDTH)];
  }

  pupperToHexLocal(pupper: number) {
    const [x, y] = this.pupperToPixelCoordsLocal(pupper);
    return KobosuJson[y][x];
  }

  coordinateToPupperLocal(x: number, y: number) {
    return this.WIDTH * y + x + this.PIXEL_TO_ID_OFFSET;
  }

  isPixelIDValid(id: number) {
    const max = this.WIDTH * this.HEIGHT + this.PIXEL_TO_ID_OFFSET - 1;
    const min = this.PIXEL_TO_ID_OFFSET;
    if (id < min || id > max) {
      return false;
    }
    return true;
  }

  getUSDPerPixel() {
    return Http.get("/v1/px/price").then(({ data }) => {
      this.usdPerPixel = data.price;
    });
  }

  @computed
  get sortedPixelOwners(): PixelOwnerInfo[] {
    const tds = ObjectKeys(this.addressToPuppers).map((key, index, arr) => ({
      address: key,
      pixels: this.addressToPuppers![key].tokenIds,
      ens: this.addressToPuppers![key].ens,
      ud: this.addressToPuppers![key].ud,
    }));
    return tds
      .filter(dog => dog.address !== ethers.constants.AddressZero)
      .filter(dog => dog.pixels.length > 0)
      .sort((a, b) => {
        if (a.pixels.length > b.pixels.length) {
          return -1;
        } else if (a.pixels.length < b.pixels.length) {
          return 1;
        } else {
          return 0;
        }
      })
  }

  getIsPupperNew(pupper: number) {
    const data = LocalStorage.getItem(VIEWED_PIXELS_LS_KEY, LocalStorage.PARSE_JSON, []);
    let isNew = true;
    if (data.includes(pupper)) {
      isNew = false;
    }
    return isNew;
  }

  setPupperSeen(pupper: number) {
    const data = LocalStorage.getItem(VIEWED_PIXELS_LS_KEY, LocalStorage.PARSE_JSON, []);
    if (!data.includes(pupper)) {
      data.push(pupper);
    }
    LocalStorage.setItem(VIEWED_PIXELS_LS_KEY, data);
  }

  getAddressDisplayName(address: string, shouldAbbreviate = true) {
    if (Object.keys(this.addressToPuppers).includes(address)) {
      const user = this.addressToPuppers[address];
      if (user?.ud) {
        return user?.ud;
      } else if (user.ens) {
        return user.ens;
      }
      return shouldAbbreviate ? abbreviate(address, 4) : address;
    } else {
      // @next -- we need to query for ENS or UD here
      return shouldAbbreviate ? abbreviate(address, 4) : address;
    }
  }
}

export default Web3Store;

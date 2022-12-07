import { Contract } from "ethers";
import { computed, makeObservable, observable } from "mobx";
import { isProduction } from "../../environment/helpers";
import { Reactionable } from "../../services/mixins/reactionable";
import AppStore from "../../store/App.store";
import { showErrorToast, showSuccessToast } from "./../../DSL/Toast/Toast";
import { EmptyClass } from "./../../helpers/mixins";
const whitelist = require("../../services/whitelists/goerliRainbowClaim.json");
const abi = require("../../contracts/rainbowClaim.json");

class RainbowStore extends Reactionable(EmptyClass) {
  private goerliAddress = "0x028e2d212aD55C09E47B22f9324d91A0C465Bb2c";
  private mainnetAddress = "";

  @observable
  showAdminTools = false;

  @observable
  rainbowContract?: Contract;

  @observable
  hasUserClaimed = false;

  @observable
  isRainbowContractApprovedToSpendPixels = false;

  @observable
  isApproving = false;

  @observable
  isDepositing = false;

  @observable
  pixelIdsInContract = [];

  @observable
  showModal = false;

  @observable
  showDrawer = false;

  @observable
  isWithdrawLoading = false;

  constructor() {
    super();
    makeObservable(this);
  }

  init() {
    this.react(
      () => [AppStore.web3.signer, AppStore.web3.pxContract],
      () => {
        if (AppStore.web3.signer) {
          this.rainbowContract = new Contract(this.contractAddress, abi, AppStore.web3.signer);
          this.getHasUserClaimed();
          if (AppStore.web3.address === this.depositorAddress) {
            this.showAdminTools = true;
            this.getPixelsInContract();
            if (AppStore.web3.pxContract) {
              this.getCanRainbowMovePixels();
            }
          }
        }
      },
    );
  }

  @computed
  get isInWhitelist() {
    return whitelist.includes(AppStore.web3.address);
  }

  @computed
  get isConnected() {
    return AppStore.web3.isConnected;
  }

  async depositPixels() {
    if (!this.rainbowContract) {
      throw new Error("Could not connect to rainbow contract");
    }
    const pixelIds = AppStore.web3.puppersOwned;
    this.isDepositing = true;
    this.rainbowContract
      .deposit(pixelIds)
      .then(res => {
        res
          .wait()
          .then(() => {
            showSuccessToast(`${pixelIds.length} pixels deposited`);
            this.isDepositing = false;
            this.getPixelsInContract();
            AppStore.web3.refreshPixelOwnershipMap();
          })
          .catch(e => console.error(e))
          .finally(() => (this.isDepositing = false));
      })
      .catch(e => {
        console.error(e);
        showErrorToast("could not deposit pixels");
        this.isDepositing = false;
      });
  }

  getCanRainbowMovePixels() {
    AppStore.web3.pxContract
      .isApprovedForAll(AppStore.web3.address, this.contractAddress)
      .then(res => {
        console.log(`is approved for all got res: ${res}`);
        this.isRainbowContractApprovedToSpendPixels = res;
      })
      .catch(e => {
        console.error(e);
        showErrorToast(e);
      });
  }

  approveRainbowPixelSpend() {
    this.isApproving = true;
    AppStore.web3.pxContract
      .setApprovalForAll(this.contractAddress, true)
      .then(res => {
        res
          .wait()
          .then(res => {
            console.log(res);
            this.getCanRainbowMovePixels();
          })
          .catch(e => console.error(e))
          .finally(() => (this.isApproving = false));
      })
      .catch(e => {
        console.error(e);
        showErrorToast(e);
        this.isApproving = false;
      });
  }

  getPixelsInContract() {
    this.rainbowContract
      .getPixelIds()
      .then(res => (this.pixelIdsInContract = res.map(item => item.toNumber())))
      .catch(e => console.error(e));
  }

  getHasUserClaimed() {
    this.rainbowContract.addressHasClaimed(AppStore.web3.address).then(res => (this.hasUserClaimed = res));
  }

  async withdraw() {
    try {
      this.isWithdrawLoading = true;
      const tx = await this.rainbowContract.withdrawPixels();
      await tx.wait();
      this.getPixelsInContract();
      await AppStore.web3.refreshPixelOwnershipMap();
    } catch (e) {
      console.error(e);
      showErrorToast("Could not withdraw");
    } finally {
      this.isWithdrawLoading = false;
    }
  }

  destroy() {
    return this.disposeReactions();
  }

  get contractAddress() {
    if (!isProduction()) {
      return this.goerliAddress;
    }
    return this.mainnetAddress;
  }

  get depositorAddress() {
    if (!isProduction()) {
      return "0x12E9d84aF808C26F21e383af5762F48b990aDC09";
    }
    return "0xaF46dc96bd783E683fD0EFeF825e6110165b8f9E";
  }

  @computed
  get userHasPixels() {
    return AppStore.web3.puppersOwned?.length > 0;
  }

  @computed
  get showClaimButton() {
    return this.isConnected && this.isInWhitelist && !this.showDrawer && !this.showModal;
  }
}

export default RainbowStore;

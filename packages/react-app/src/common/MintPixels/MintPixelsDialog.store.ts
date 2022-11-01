import { SimpleGetQuoteResponse } from "@cowprotocol/cow-sdk/dist/api/cow/types";
import * as Sentry from "@sentry/react";
import { BigNumber, Contract, ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { computed, makeObservable, observable, toJS } from "mobx";
import erc20 from "../../contracts/erc20.json";
import { showDebugToast, showErrorToast } from "../../DSL/Toast/Toast";
import env from "../../environment";
import { Constructor, EmptyClass } from "../../helpers/mixins";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";
import { sleep } from "../../helpers/sleep";
import { Navigable } from "../../services/mixins/navigable";
import { Reactionable } from "../../services/mixins/reactionable";
import AppStore from "../../store/App.store";

export const GPv2VaultRelayerAddress = "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110";

export enum MintModalView {
  Form = "mint",
  VaultApproval = "vaultApproval",
  DogApproval = "approval",
  CowSwap = "cowSwap",
  LoadingVaultApproval = "loadingVaultApproval",
  LoadingDogApproval = "loadingDogApproval",
  MintPixels = "mintPixels",
  Complete = "complete",
}

class MintPixelsDialogStore extends Reactionable(Navigable<MintModalView, Constructor>(EmptyClass)) {
  @observable
  pixelCount: number | string = 1;

  @observable
  hasUserSignedTx = false;

  @observable
  approveInfiniteDOG = false;

  @observable
  approveInfiniteVault = false;

  @observable
  txHash: string | null = null;

  @observable
  srcCurrency = "DOG";

  @observable
  srcCurrencyContract: Contract | null = null;

  @observable
  cowSimpleQuote?: SimpleGetQuoteResponse | null = null;

  @observable
  recentQuote: {
    srcCurrency: string;
    srcCurrencyAmount: number;
    srcCurrencyFee: number;
    srcCurrencyTotal: number;
    effectiveRate: number;
    dogAmount: number;
    computedPixelCount: string;
    maxPixelAmount: number;
    _srcCurrencyAmount: BigNumber;
    _srcCurrencyFee: BigNumber;
    _srcCurrencyTotal: BigNumber;
    _dogAmount: BigNumber;
  } | null = null;

  @observable
  srcCurrencyBalance: { humanReadable: null | number; bigNumber: null | BigNumber } = {
    humanReadable: null,
    bigNumber: null,
  };

  @observable
  isLoading = true;

  @observable
  isOrderComplete = false;

  @observable
  cowSwapOrderID?: string;

  @observable
  private _pollOrdersTick = 0;

  @observable
  oldPixels: number[] = [];

  @observable
  diffPixels: number[] = [];

  constructor() {
    super();
    makeObservable(this);
  }

  init() {
    this.pushNavigation(MintModalView.Form);
    this.react(
      () => [this.srcCurrency, this.pixelCount],
      async () => {
        if (Number(this.pixelCount) > 0) {
          this.setSrcCurrencyContract();
          await this.getSrcCurrencyBalance();
          try {
            await this.getQuote();
          } catch (e) {
            this.isLoading = false;
            console.error("could not get quote");
            showErrorToast("Could not get quote");
          }
        } else {
          this.isLoading = false;
          this.recentQuote = null;
        }
      },
      { fireImmediately: true },
    );

    this.react(
      () => this._pollOrdersTick,
      async () => {
        const orders = await AppStore.web3.cowStore.getOrders({ owner: AppStore.web3.address! });
        const placedOrder = orders?.filter(order => order.uid === this.cowSwapOrderID)[0];
        if (placedOrder && placedOrder.status === "fulfilled") {
          this.isOrderComplete = true;
          this.pushNavigation(MintModalView.MintPixels);
        } else if (placedOrder && (placedOrder.status === "cancelled" || placedOrder.status === "expired")) {
          this.isOrderComplete = false;
          showErrorToast("Cow protocol order was cancelled or expired");
          this.popNavigation();
        } else {
          await sleep(4000);
          this._pollOrdersTick += 1;
        }
      },
    );
  }

  setSrcCurrencyContract() {
    if (this.srcCurrency === "DOG") {
      this.srcCurrencyContract = AppStore.web3.dogContract as unknown as Contract;
    } else {
      console.log("debug:: src currency contract", this.srcCurrencyDetails.contractAddress);
      this.srcCurrencyContract = new ethers.Contract(
        this.srcCurrencyDetails.contractAddress,
        erc20,
        AppStore.web3.signer!,
      );
    }
  }

  async getSrcCurrencyBalance() {
    const balance = await this.srcCurrencyContract!.balanceOf(AppStore.web3.address!);
    const formattedBalance = Number(ethers.utils.formatUnits(balance, this.srcCurrencyDetails.decimals));
    this.srcCurrencyBalance = {
      bigNumber: balance,
      humanReadable: formattedBalance,
    };
  }

  async getQuote() {
    this.isLoading = true;
    if (this.srcCurrency === "DOG") {
      const dogAmount = Number(ethers.utils.formatUnits(AppStore.web3.DOG_TO_PIXEL_SATOSHIS.mul(this.pixelCount), 18));
      this.recentQuote = {
        srcCurrency: this.srcCurrency,
        srcCurrencyAmount: dogAmount,
        srcCurrencyFee: 0,
        srcCurrencyTotal: dogAmount,
        effectiveRate: 1,
        dogAmount: dogAmount,
        computedPixelCount: this.pixelCount.toString(),
        maxPixelAmount: this.srcCurrencyBalance.humanReadable
          ? Math.floor(
              this.srcCurrencyBalance.humanReadable /
                Number(ethers.utils.formatUnits(AppStore.web3.DOG_TO_PIXEL_SATOSHIS, 18)),
            )
          : 0,
        _srcCurrencyAmount: AppStore.web3.DOG_TO_PIXEL_SATOSHIS.mul(this.pixelCount),
        _srcCurrencyFee: BigNumber.from(0),
        _srcCurrencyTotal: AppStore.web3.DOG_TO_PIXEL_SATOSHIS.mul(this.pixelCount),
        _dogAmount: AppStore.web3.DOG_TO_PIXEL_SATOSHIS.mul(this.pixelCount),
      };
    } else {
      this.cowSimpleQuote = await AppStore.web3.cowStore.getQuoteForPixels({
        sellAddress: this.srcCurrencyDetails.contractAddress,
        pixelCount: this.pixelCount,
        userAddress: AppStore.web3.address!,
      });

      const sellAmount = this.cowSimpleQuote!.quote.sellAmount;
      const slippageAmount = BigNumber.from(sellAmount).mul(15).div(100);
      const newAmount = BigNumber.from(sellAmount).add(slippageAmount);
      this.cowSimpleQuote!.quote.sellAmount = newAmount.toString();

      const formattedAmount = Number(this.formatToDecimals(this.cowSimpleQuote!.quote.sellAmount, this.srcCurrency));
      const feeFormatted = Number(this.formatToDecimals(this.cowSimpleQuote!.quote.feeAmount, this.srcCurrency));
      const dogFormatted = Number(this.formatToDecimals(this.cowSimpleQuote!.quote.buyAmount, "DOG"));
      const total = formattedAmount + feeFormatted;
      this.recentQuote = {
        srcCurrency: this.srcCurrency,
        srcCurrencyAmount: Number(formattedAmount),
        srcCurrencyFee: Number(feeFormatted),
        srcCurrencyTotal: total,
        effectiveRate: total / dogFormatted,
        dogAmount: dogFormatted,
        computedPixelCount: BigNumber.from(this.cowSimpleQuote!.quote.buyAmount)
          .div(AppStore.web3.DOG_TO_PIXEL_SATOSHIS)
          .toString(),
        maxPixelAmount: this.srcCurrencyBalance.humanReadable
          ? Math.floor(
              this.srcCurrencyBalance.humanReadable /
                ((total / dogFormatted) * Number(ethers.utils.formatUnits(AppStore.web3.DOG_TO_PIXEL_SATOSHIS, 18))),
            )
          : 0,
        _srcCurrencyAmount: BigNumber.from(this.cowSimpleQuote!.quote.sellAmount),
        _srcCurrencyFee: BigNumber.from(this.cowSimpleQuote!.quote.feeAmount),
        _srcCurrencyTotal: BigNumber.from(this.cowSimpleQuote!.quote.sellAmount).add(
          BigNumber.from(this.cowSimpleQuote!.quote.feeAmount),
        ),
        _dogAmount: BigNumber.from(this.cowSimpleQuote!.quote.buyAmount),
      };
    }
    this.isLoading = false;
  }

  @computed
  get srcCurrencyDetails() {
    return env.app.availableTokens[this.srcCurrency];
  }

  formatToDecimals(amount: string, currency: string) {
    return formatUnits(BigNumber.from(amount), env.app.availableTokens[currency].decimals);
  }

  async handleMintSubmit() {
    if (this.srcCurrency !== "DOG") {
      if (await this.getHasDOGAllowance()) {
        if (await this.getHasVaultAllowance()) {
          this.pushNavigation(MintModalView.CowSwap);
        } else {
          this.pushNavigation(MintModalView.VaultApproval);
        }
      } else {
        this.pushNavigation(MintModalView.DogApproval);
      }
    } else {
      if (await this.getHasDOGAllowance()) {
        this.pushNavigation(MintModalView.MintPixels);
      } else {
        this.pushNavigation(MintModalView.DogApproval);
      }
    }
  }

  async getHasDOGAllowance() {
    const allowance = await AppStore.web3.getPxDogSpendAllowance();
    return allowance.gte(this.recentQuote!._dogAmount);
  }

  async getHasVaultAllowance() {
    const tokenAllowance = await this.srcCurrencyContract!.allowance(AppStore.web3.address, GPv2VaultRelayerAddress);
    return tokenAllowance?.gte(this.recentQuote?._srcCurrencyTotal);
  }

  async mintPixels(amount: number) {
    this.hasUserSignedTx = false;
    try {
      const estimatedGas = await AppStore.web3.pxContract?.estimateGas.mintPuppers(amount);
      if (!estimatedGas) {
        throw Error("Could not estimate gas");
      }

      const gasLimitSafetyOffset = 80000;
      const tx = await AppStore.web3.mintPuppers(amount, estimatedGas.add(gasLimitSafetyOffset));

      this.hasUserSignedTx = true;
      this.oldPixels = toJS(AppStore.web3.puppersOwned);
      showDebugToast(`minting ${this.pixelCount!} pixel`);
      const receipt = await tx.wait();
      this.txHash = receipt.transactionHash;

      await AppStore.web3.refreshPixelOwnershipMap();
      const newPixels = toJS(AppStore.web3.puppersOwned);
      const mintedPixels = newPixels.filter(pixel => {
        if (!this.oldPixels.includes(pixel)) {
          return 1;
        }
        return 0;
      });
      const burnedPixels = this.oldPixels.filter(pixel => {
        if (!newPixels.includes(pixel)) {
          return 1;
        }
        return 0;
      });
      this.diffPixels = mintedPixels.concat(burnedPixels);
      this.pushNavigation(MintModalView.Complete);
    } catch (e) {
      Sentry.captureException(e);
      showErrorToast("error minting");
      console.error(e);
      this.hasUserSignedTx = false;
      this.destroyNavigation();
      this.pushNavigation(MintModalView.Form);
    }
  }

  async approveVaultSpend() {
    this.hasUserSignedTx = false;
    try {
      let allowance = this.recentQuote!._srcCurrencyTotal;
      if (this.approveInfiniteVault) {
        allowance = ethers.constants.MaxUint256;
      }

      if (!this.srcCurrencyContract) {
        throw new Error("Cannot find source currency contract");
      }

      const tx = await this.srcCurrencyContract.approve(GPv2VaultRelayerAddress, allowance);
      this.hasUserSignedTx = true;
      showDebugToast(
        `approving ${this.srcCurrency} vault spend: ${ethers.utils.formatUnits(
          allowance,
          this.srcCurrencyDetails.decimals,
        )}`,
      );
      await tx.wait();
      this.pushNavigation(MintModalView.CowSwap);
    } catch (e) {
      console.error(e);
      this.hasUserSignedTx = false;
      this.popNavigation();
      showErrorToast("Error approving vault spend");
    }
  }

  async placeCowswapOrder() {
    try {
      this.hasUserSignedTx = false;
      this.cowSwapOrderID = await AppStore.web3.cowStore.acceptSimpleQuote(this.cowSimpleQuote!);
      this.hasUserSignedTx = true;
      this._pollOrdersTick += 1;
    } catch (e) {
      console.error("could not trade", e);
      let errorMessage = "Could not place order";
      //@ts-ignore
      if (e?.message) {
        //@ts-ignore
        errorMessage += `\n\n${e.message}`;
      }
      showErrorToast(errorMessage);
      this.popNavigation();
      this.hasUserSignedTx = false;
    }
  }

  async approveDogSpend() {
    this.hasUserSignedTx = false;
    let allowance = this.recentQuote!._dogAmount;
    try {
      if (this.approveInfiniteDOG) {
        allowance = ethers.constants.MaxUint256;
      }
      const tx = await AppStore.web3.approvePxSpendDog(allowance);
      this.hasUserSignedTx = true;
      showDebugToast(`approving DOG spend: ${formatWithThousandsSeparators(ethers.utils.formatEther(allowance))}`);
      await tx.wait();

      if (this.srcCurrency === "DOG") {
        this.pushNavigation(MintModalView.MintPixels);
      } else {
        if (await this.getHasVaultAllowance()) {
          this.pushNavigation(MintModalView.CowSwap);
        } else {
          this.pushNavigation(MintModalView.VaultApproval);
        }
      }
    } catch (e) {
      this.hasUserSignedTx = false;
      this.popNavigation();
      showErrorToast("Error approving DOG spend");
    }
  }

  @computed
  get title() {
    switch (this.currentView) {
      case MintModalView.Form:
        return "Mint Pixels";
      case MintModalView.DogApproval:
        return "Approve DOG";
      case MintModalView.VaultApproval:
        return "Pixel Router Approval";
      default:
        return "";
    }
  }

  @computed
  get description() {
    switch (this.currentView) {
      case MintModalView.Form:
        return "Mint a pixel of The Doge NFT, randomly selected from all 307,200 pixels.";
      default:
        return undefined;
    }
  }

  @computed
  get srcCurrencySelectItems() {
    return Object.keys(env.app.availableTokens).map((token: string) => ({ id: token, name: token }));
  }

  @computed
  get stepperItems() {
    return [];
  }

  incrementPixelCount() {
    this.pixelCount = Number(this.pixelCount) + 1;
  }

  decrementPixelCount() {
    this.pixelCount = Number(this.pixelCount) - 1;
  }

  @computed
  get canMint() {
    if (this.srcCurrencyBalance.bigNumber && this.recentQuote) {
      return this.recentQuote._srcCurrencyTotal.lte(this.srcCurrencyBalance.bigNumber);
    }
    return false;
  }

  destroy() {
    return this.disposeReactions();
  }
}

export default MintPixelsDialogStore;

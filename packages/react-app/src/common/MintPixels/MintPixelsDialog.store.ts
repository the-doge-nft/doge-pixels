import {computed, makeObservable, observable} from "mobx";
import {Navigable} from "../../services/mixins/navigable";
import {Reactionable} from "../../services/mixins/reactionable";
import {Constructor, EmptyClass} from "../../helpers/mixins";
import {BigNumber, Contract, ethers} from "ethers";
import AppStore from "../../store/App.store";
import {showDebugToast, showErrorToast} from "../../DSL/Toast/Toast";
import {formatWithThousandsSeparators} from "../../helpers/numberFormatter";
import * as Sentry from "@sentry/react";
import {SimpleGetQuoteResponse} from "@cowprotocol/cow-sdk/dist/api/cow/types";
import env from "../../environment";
import {debounce} from "lodash";
import erc20 from "../../contracts/erc20.json"
import {formatUnits} from "ethers/lib/utils";

export const GPv2VaultRelayerAddress = "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110"

export enum MintModalView {
    Mint = "mint",
    Approval = "approval",
    LoadingApproval = "loadingApproval",
    LoadingPixels = "loadingPixels",
    Complete = "complete"
}

class MintPixelsDialogStore extends Reactionable((Navigable<MintModalView, Constructor>(EmptyClass))) {
    @observable
    pixelCount: number | string = 1;

    @observable
    allowance?: BigNumber

    @observable
    allowanceToGrant: BigNumber = BigNumber.from(0)

    @observable
    hasUserSignedTx = false

    @observable
    approveInfinite = false

    @observable
    txHash: string | null = null

    @observable
    srcCurrency = "DOG"

    @observable
    srcCurrencyContract: Contract | null = null

    @observable
    private quote?: SimpleGetQuoteResponse | null = null

    @observable
    recentQuote: {
        srcCurrency: string,
        srcCurrencyAmount: number,
        srcCurrencyFee: number,
        srcCurrencyTotal: number,
        effectiveRate: number,
        dogAmount: number,
        computedPixelCount: string,
        maxPixelAmount: number
    } | null = null

    @observable
    srcCurrencyBalance: number | null = null

    @observable
    isLoading = false

    constructor() {
        super();
        makeObservable(this);
    }

    init() {
        this.pushNavigation(MintModalView.Mint);
        this.refreshAllowance()
        this.react(() => [this.srcCurrency, this.pixelCount], async () => {
            console.log("debug:: trigger")
            if (this.srcCurrency !== "DOG" && Number(this.pixelCount) > 0) {
                this.getQuote()
                this.srcCurrencyContract = new ethers.Contract(this.srcCurrencyDetails.contractAddress, erc20, AppStore.web3.signer!)
                const balance = await this.srcCurrencyContract.balanceOf(AppStore.web3.address!)
                const formattedBalance = balance.div(BigNumber.from(10).pow(this.srcCurrencyDetails.decimals))
                this.srcCurrencyBalance = formattedBalance.toNumber()
                console.log("debug:: src currency balance", balance.div(BigNumber.from(10).pow(this.srcCurrencyDetails.decimals)).toString())
            } else {
                this.isLoading = false
                console.log("debug:: skipping")
            }
        })
    }

    async getQuote() {
        this.isLoading = true
        this.quote = await AppStore.web3.getQuoteForPixels({
            sellAddress: this.srcCurrencyDetails.contractAddress,
            amountPixels: this.pixelCount,
        })

        const formattedAmount = Number(this.formatToDecimals(this.quote!.quote.sellAmount, this.srcCurrency))
        const feeFormatted = Number(this.formatToDecimals(this.quote!.quote.feeAmount, this.srcCurrency))
        const dogFormatted = Number(this.formatToDecimals(this.quote!.quote.buyAmount, "DOG"))
        const total = formattedAmount + feeFormatted
        this.recentQuote = {
            srcCurrency: this.srcCurrency,
            srcCurrencyAmount: Number(formattedAmount),
            srcCurrencyFee: Number(feeFormatted),
            srcCurrencyTotal: total,
            effectiveRate: total / dogFormatted,
            dogAmount: dogFormatted,
            computedPixelCount: BigNumber.from(this.quote!.quote.buyAmount).div(AppStore.web3.DOG_TO_PIXEL_SATOSHIS).toString(),
            maxPixelAmount: this.srcCurrencyBalance ? Math.floor(this.srcCurrencyBalance / ((total / dogFormatted) * Number(ethers.utils.formatUnits(AppStore.web3.DOG_TO_PIXEL_SATOSHIS, 18)))) : 0
        }
        this.isLoading = false
    }

    @computed
    get srcCurrencyDetails() {
        return env.app.availableTokens[this.srcCurrency]
    }

    formatToDecimals(amount: string, currency: string) {
        return formatUnits(BigNumber.from(amount), env.app.availableTokens[currency].decimals)
    }

    async refreshAllowance() {
        try {
            this.allowance = await AppStore.web3.getPxDogSpendAllowance()
        } catch (e) {
            showErrorToast("Could not get allowance")
        }
    }

    @computed
    get stepperItems() {
        return [];
    }

    handleMintSubmit(pixel_amount: number) {
        const dogToSpend = AppStore.web3.DOG_TO_PIXEL_SATOSHIS.mul(pixel_amount)
        if (this.allowance!.lt(dogToSpend)) {
            this.allowanceToGrant = dogToSpend
            this.pushNavigation(MintModalView.Approval)
        } else {
            this.pushNavigation(MintModalView.LoadingPixels)
        }
    }

    async mintPixels(amount: number) {
        this.hasUserSignedTx = false
        try {
            const estimatedGas = await AppStore.web3.pxContract?.estimateGas.mintPuppers(amount)
            if (!estimatedGas) {
                throw Error("Could not estimate gas")
            }

            const gasLimitSafetyOffset = 80000
            const tx = await AppStore.web3.mintPuppers(amount, estimatedGas.add(gasLimitSafetyOffset))

            this.hasUserSignedTx = true
            showDebugToast(`minting ${this.pixelCount!} pixel`)
            const receipt = await tx.wait()
            this.txHash = receipt.transactionHash
            this.pushNavigation(MintModalView.Complete)
        } catch (e) {
            Sentry.captureException(e)
            showErrorToast("error minting")
            console.error(e)
            this.hasUserSignedTx = false
            this.destroyNavigation()
            this.pushNavigation(MintModalView.Mint)
        }
    }


    async approveDogSpend() {
        this.hasUserSignedTx = false
        try {
            if (this.approveInfinite) {
                this.allowanceToGrant = ethers.constants.MaxUint256
            }
            const tx = await AppStore.web3.approvePxSpendDog(this.allowanceToGrant)
            this.hasUserSignedTx = true
            showDebugToast(`approving DOG spend: ${formatWithThousandsSeparators(ethers.utils.formatEther(this.allowanceToGrant))}`)
            await tx.wait()
            this.refreshAllowance()
            this.pushNavigation(MintModalView.LoadingPixels)
        } catch (e) {
            this.hasUserSignedTx = false
            this.popNavigation()
            showErrorToast("Error approving $DOG spend")
        }
    }

    @computed
    get title() {
        switch (this.currentView) {
            case MintModalView.Mint:
                return "Mint Pixels"
            case MintModalView.Approval:
                return "Approve $DOG"
            default:
                return ""
        }
    }

    @computed
    get dogCount() {
        if (this.pixelCount) {
            //@CC: TODO protect agaist edge cases here "0.1" "-" etc
            if (this.pixelCount === "-" || this.pixelCount === ".") {
                return 0
            }
            return ethers.utils.formatEther(AppStore.web3.DOG_TO_PIXEL_SATOSHIS.mul(this.pixelCount))
        } else {
            return 0
        }
    }

    @computed
    get description() {
        switch (this.currentView) {
            case MintModalView.Mint:
                return "Trade $DOG for pixels. Each pixel is randomly selected from all 307,200 pixels."
            default:
                return undefined
        }
    }

    @computed
    get srcCurrencySelectItems() {
        return Object.keys(env.app.availableTokens).map((token: string) => ({id: token, name: token}))
    }
}

export default MintPixelsDialogStore;

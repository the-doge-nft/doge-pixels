import {computed, makeObservable, observable} from "mobx";
import {Navigable} from "../../services/mixins/navigable";
import {Reactionable} from "../../services/mixins/reactionable";
import {Constructor, EmptyClass} from "../../helpers/mixins";
import {BigNumber, ethers} from "ethers";
import AppStore from "../../store/App.store";
import {showDebugToast, showErrorToast} from "../../DSL/Toast/Toast";
import {formatWithThousandsSeparators} from "../../helpers/numberFormatter";
import * as Sentry from "@sentry/react";
import {SimpleGetQuoteResponse} from "@cowprotocol/cow-sdk/dist/api/cow/types";
import env from "../../environment";
import {debounce} from "lodash";


export enum MintModalView {
    Mint = "mint",
    Approval = "approval",
    LoadingApproval = "loadingApproval",
    LoadingPixels = "loadingPixels",
    Complete = "complete"
}

class MintPixelsDialogStore extends Reactionable((Navigable<MintModalView, Constructor>(EmptyClass))) {
    @observable
    pixel_count: number | string = 1;

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
    selectedToken = "DOG"

    @observable
    quote?: SimpleGetQuoteResponse | null = null

    @observable
    recentQuote: {
        currency: string,
        amount: string,
        fee: string,
        dogAmount: string
    } | null = null

    @observable
    isLoading = true

    constructor() {
        super();
        makeObservable(this);
    }

    init() {
        this.pushNavigation(MintModalView.Mint);
        this.refreshAllowance()
        this.react(() => [this.selectedToken, this.pixel_count], () => {
            console.log("debug:: trigger")
            this.getQuoteDebouced()
        })
    }

    getQuoteDebouced() {
        console.log("debug:: hit")
        debounce(this.getQuote.bind(this), 500)
    }

    async getQuote() {
        console.log("debug:: change", this.selectedToken, this.pixel_count)
        const sellAddress = env.app.availableTokens[this.selectedToken].contractAddress
        const quote = await AppStore.web3.getQuoteForPixels({
            sellAddress,
            amountPixels: this.pixel_count,
        })

        const formattedAmount = this.formatToDecimals(quote!.quote.sellAmount, this.selectedToken)
        const feeFormatted = this.formatToDecimals(quote!.quote.feeAmount, this.selectedToken)
        this.recentQuote = {
            currency: this.selectedToken,
            amount: formattedAmount,
            fee: feeFormatted,
            dogAmount: ethers.utils.formatEther(quote!.quote.buyAmount)
        }
    }

    formatToDecimals(amount: string, currency: string) {
        return formatWithThousandsSeparators(BigNumber.from(amount)
            .div((BigNumber.from(10).pow(env.app.availableTokens[currency].decimals))).toString())
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

    @computed
    get maxPixelsToPurchase() {
        if (AppStore.web3.dogBalance) {
            // num & denom in ether
            return AppStore.web3.dogBalance.div(AppStore.web3.DOG_TO_PIXEL_SATOSHIS).toNumber()
        } else return 0
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
            showDebugToast(`minting ${this.pixel_count!} pixel`)
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
        if (this.pixel_count) {
            //@CC: TODO protect agaist edge cases here "0.1" "-" etc
            if (this.pixel_count === "-" || this.pixel_count === ".") {
                return 0
            }
            return ethers.utils.formatEther(AppStore.web3.DOG_TO_PIXEL_SATOSHIS.mul(this.pixel_count))
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
    get selectItems() {
        const availableTokens = env.app.availableTokens
        const baseItems = Object.keys(availableTokens).map(token => ({id: token, name: token}))
        baseItems.push({id: "DOG", name: "DOG"})
        return baseItems
    }
}

export default MintPixelsDialogStore;

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
import erc20 from "../../contracts/erc20.json"
import {formatUnits} from "ethers/lib/utils";

export const GPv2VaultRelayerAddress = "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110"

export enum MintModalView {
    Form = "mint",
    VaultApproval = "vaultApproval",
    DogApproval = "approval",
    CowSwap = "cowSwap",
    LoadingVaultApproval = "loadingVaultApproval",
    LoadingDogApproval = "loadingDogApproval",
    MintPixels = "mintPixels",
    Complete = "complete"
}

class MintPixelsDialogStore extends Reactionable((Navigable<MintModalView, Constructor>(EmptyClass))) {
    @observable
    pixelCount: number | string = 1;

    @observable
    allowance?: BigNumber

    @observable
    dogAllowanceToGrant: BigNumber = BigNumber.from(0)

    @observable
    vaultAllowanceToGrant: BigNumber = BigNumber.from(0)

    @observable
    hasUserSignedTx = false

    @observable
    approveInfiniteDOG = false

    @observable
    approveInfiniteVault = false

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
        maxPixelAmount: number,
        _srcCurrencyAmount: BigNumber,
        _srcCurrencyFee: BigNumber,
        _srcCurrencyTotal: BigNumber
        _dogAmount: BigNumber
    } | null = null

    @observable
    srcCurrencyBalance: number | null = null

    @observable
    isLoading = true

    constructor() {
        super();
        makeObservable(this);
    }

    init() {
        this.pushNavigation(MintModalView.Form);
        this.refreshAllowance()
        this.react(() => [this.srcCurrency, this.pixelCount], async () => {
            console.log("debug:: trigger")
            if (Number(this.pixelCount) > 0) {
                this.setSrcCurrencyContract()
                await this.getSrcCurrencyBalance()
                this.getQuote()
            } else {
                this.isLoading = false
                this.recentQuote = null
            }
        }, {fireImmediately: true})
    }

    setSrcCurrencyContract() {
        this.srcCurrencyContract = new ethers.Contract(this.srcCurrencyDetails.contractAddress, erc20, AppStore.web3.signer!)
    }

    async getSrcCurrencyBalance() {
        const balance = await this.srcCurrencyContract!.balanceOf(AppStore.web3.address!)
        const formattedBalance = balance.div(BigNumber.from(10).pow(this.srcCurrencyDetails.decimals))
        this.srcCurrencyBalance = formattedBalance.toNumber()
    }

    async getQuote() {
        console.log("degbug:: getting quote")
        this.isLoading = true
        if (this.srcCurrency === "DOG") {
            const dogAmount = Number(ethers.utils.formatUnits(AppStore.web3.DOG_TO_PIXEL_SATOSHIS.mul(this.pixelCount), 18))
            this.recentQuote = {
                srcCurrency: this.srcCurrency,
                srcCurrencyAmount: dogAmount,
                srcCurrencyFee: 0,
                srcCurrencyTotal: dogAmount,
                effectiveRate: 1,
                dogAmount: dogAmount,
                computedPixelCount: this.pixelCount.toString(),
                maxPixelAmount: this.srcCurrencyBalance ? Math.floor(this.srcCurrencyBalance / Number(ethers.utils.formatUnits(AppStore.web3.DOG_TO_PIXEL_SATOSHIS, 18))) : 0,
                _srcCurrencyAmount: AppStore.web3.DOG_TO_PIXEL_SATOSHIS.mul(this.pixelCount),
                _srcCurrencyFee: BigNumber.from(0),
                _srcCurrencyTotal: AppStore.web3.DOG_TO_PIXEL_SATOSHIS.mul(this.pixelCount),
                _dogAmount: AppStore.web3.DOG_TO_PIXEL_SATOSHIS.mul(this.pixelCount)
            }
        } else {
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
                maxPixelAmount: this.srcCurrencyBalance ? Math.floor(this.srcCurrencyBalance / ((total / dogFormatted) * Number(ethers.utils.formatUnits(AppStore.web3.DOG_TO_PIXEL_SATOSHIS, 18)))) : 0,
                _srcCurrencyAmount: BigNumber.from(this.quote!.quote.sellAmount),
                _srcCurrencyFee: BigNumber.from(this.quote!.quote.feeAmount),
                _srcCurrencyTotal: BigNumber.from(this.quote!.quote.sellAmount).add(BigNumber.from(this.quote!.quote.feeAmount)),
                _dogAmount: BigNumber.from(this.quote!.quote.buyAmount)
            }
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

    async handleMintSubmit(pixel_amount: number) {
        if (this.srcCurrency !== "DOG") {
            const tokenAllowance = await this.srcCurrencyContract!.allowance(AppStore.web3.address, GPv2VaultRelayerAddress)
            if (tokenAllowance.lt(this.recentQuote?._srcCurrencyTotal)) {
                this.vaultAllowanceToGrant = this.recentQuote!._srcCurrencyTotal
                this.pushNavigation(MintModalView.VaultApproval)
            } else {
                this.pushNavigation(MintModalView.CowSwap)
            }
            console.log("debug:: token allowance", tokenAllowance.toString())
        } else {
            const dogToSpend = AppStore.web3.DOG_TO_PIXEL_SATOSHIS.mul(pixel_amount)
            if (this.allowance!.lt(dogToSpend)) {
                this.dogAllowanceToGrant = dogToSpend
                this.pushNavigation(MintModalView.DogApproval)
            } else {
                this.pushNavigation(MintModalView.MintPixels)
            }
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
            this.pushNavigation(MintModalView.Form)
        }
    }

    async approveVaultSpend() {
        this.hasUserSignedTx = false
        try {
            if (this.approveInfiniteVault) {
                this.vaultAllowanceToGrant = ethers.constants.MaxUint256
            } else {
                this.vaultAllowanceToGrant = this.recentQuote!._srcCurrencyTotal
                console.log("debug:: src currency total", this.recentQuote?.srcCurrencyTotal, ethers.utils.formatUnits(this.recentQuote!._srcCurrencyTotal, this.srcCurrencyDetails.decimals))
            }
            const tx = await this.srcCurrencyContract!.approve(GPv2VaultRelayerAddress, this.vaultAllowanceToGrant)
            this.hasUserSignedTx = true
            showDebugToast(`approving ${this.srcCurrency} vault spend: ${ethers.utils.formatUnits(this.srcCurrency, this.srcCurrencyDetails.decimals)}`)
            await tx.wait()
            this.pushNavigation(MintModalView.CowSwap)
        } catch (e) {
            this.hasUserSignedTx = false
            this.popNavigation()
            showErrorToast("Error approving vault spend")
        }
    }

    async approveDogSpend() {
        this.hasUserSignedTx = false
        try {
            if (this.approveInfiniteDOG) {
                this.dogAllowanceToGrant = ethers.constants.MaxUint256
            }
            const tx = await AppStore.web3.approvePxSpendDog(this.dogAllowanceToGrant)
            this.hasUserSignedTx = true
            showDebugToast(`approving DOG spend: ${formatWithThousandsSeparators(ethers.utils.formatEther(this.dogAllowanceToGrant))}`)
            await tx.wait()
            this.refreshAllowance()
            this.pushNavigation(MintModalView.MintPixels)
        } catch (e) {
            this.hasUserSignedTx = false
            this.popNavigation()
            showErrorToast("Error approving $DOG spend")
        }
    }

    @computed
    get title() {
        switch (this.currentView) {
            case MintModalView.Form:
                return "Mint Pixels"
            case MintModalView.DogApproval:
                return "Approve $DOG"
            case MintModalView.VaultApproval:
                return "Pixel Router Approval"
            default:
                return ""
        }
    }

    @computed
    get description() {
        switch (this.currentView) {
            case MintModalView.Form:
                return "Trade $DOG for pixels. Each pixel is randomly selected from all 307,200 pixels."
            default:
                return undefined
        }
    }

    @computed
    get srcCurrencySelectItems() {
        return Object.keys(env.app.availableTokens).map((token: string) => ({id: token, name: token}))
    }

    @computed
    get stepperItems() {
        return [];
    }
}

export default MintPixelsDialogStore;

import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {Box, Flex, Spinner} from "@chakra-ui/react";
import MintPixelsModalStore from "../../pages/Viewer/MintPixelsModal/MintPixelsModal.store";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import Form from "../../DSL/Form/Form";
import BigInput from "../../DSL/Form/BigInput";
import {maxValue, minValue, required} from "../../DSL/Form/validation";
import {formatWithThousandsSeparators} from "../../helpers/numberFormatter";
import Submit from "../../DSL/Form/Submit";
import {ethers} from "ethers";
import CheckboxInput from "../../DSL/Form/CheckboxInput/CheckboxInput";
import model from "../../DSL/Form/model";
import Button from "../../DSL/Button/Button";
import Loading from "../../DSL/Loading/Loading";
import Link from "../../DSL/Link/Link";
import {getEtherscanURL} from "../../helpers/links";
import MintPixelsDialogStore, {MintModalView} from "./MintPixelsDialog.store";
import AppStore from "../../store/App.store";
import Select from "../../DSL/Select/Select";
import Icon from "../../DSL/Icon/Icon";
import Dev from "../Dev";

interface MintPixelsDialogProps {
    store: MintPixelsDialogStore;
    onSuccess: () => void;
    onGoToPixelsClick: () => void
}

const MintPixelsDialog = observer(({store, onSuccess, onGoToPixelsClick}: MintPixelsDialogProps) => {
    useEffect(() => {
        store.init()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (store.currentView === MintModalView.Complete) {
            onSuccess && onSuccess()
            AppStore.web3.refreshPupperOwnershipMap()
            AppStore.web3.refreshPupperBalance()
            AppStore.web3.refreshDogBalance()
        }
        // eslint-disable-next-line
    }, [store.currentView])

    return <>
        {store.currentView === MintModalView.Mint && <MintForm store={store}/>}
        {store.currentView === MintModalView.Approval && <Approval store={store}/>}
        {store.currentView === MintModalView.LoadingApproval && <LoadingApproval store={store}/>}
        {store.currentView === MintModalView.LoadingPixels && <LoadingPixels store={store}/>}
        {store.currentView === MintModalView.Complete &&
        <Complete onSuccess={onGoToPixelsClick} txHash={store.txHash}/>}
    </>
})

const MintForm = observer(({store}: { store: MintPixelsModalStore }) => {
    const [showLabel, setShowLabel] = useState(true)

    useEffect(() => {
        if (Number(store.pixelCount) >= 100) {
            setShowLabel(false)
        } else if (Number(store.pixelCount && !showLabel) < 100) {
            setShowLabel(true)
        }
    }, [store.pixelCount])


    return (
        <>
            <Form onSubmit={async (data) => store.handleMintSubmit(data.pixel_count)}>
                <Box mt={5}>
                    <BigInput
                        store={store}
                        storeKey={"pixelCount"}
                        label={showLabel ? "PX" : undefined}
                        validate={[
                            required("1 pixel minimum"),
                            minValue(1, "Must mint at least 1 pixel"),
                            maxValue(store.recentQuote?.maxPixelAmount, `Not enough ${store.srcCurrency}`)
                        ]}
                        renderLeftOfValidation={() => {
                            return <Box>
                                <Box>
                                    <Typography variant={TVariant.PresStart12}>Mint for currency</Typography>
                                    <Box mt={1}>
                                        <Select
                                            items={store.srcCurrencySelectItems}
                                            value={store.srcCurrency}
                                            onChange={(val) => {
                                                store.srcCurrency = val
                                            }}/>
                                    </Box>
                                </Box>
                                {store.isLoading && <Box display={"flex"} justifyContent={"center"}><Spinner mt={4} color={"yellow.700"}/></Box>}
                                {store.recentQuote && !store.isLoading && <Box mt={4} display={"flex"} flexDirection={"column"}>
                                  <Typography variant={TVariant.ComicSans14}>
                                      {store.recentQuote.computedPixelCount} Pixel{store.pixelCount === 1 ? '' : 's'} = {formatWithThousandsSeparators(store.recentQuote.srcCurrencyTotal)} {store.recentQuote.srcCurrency}
                                  </Typography>
                                  <Typography variant={TVariant.ComicSans14} mt={3}>
                                    Max you can mint: {store.recentQuote.maxPixelAmount}
                                  </Typography>
                                  <Typography variant={TVariant.ComicSans12}>
                                    Your balance: {store.srcCurrencyBalance} {store.srcCurrency}
                                  </Typography>
                                </Box>}
                            </Box>
                        }}
                    />
                </Box>

                <Box my={6}>
                    {store.isLoading && <Box display={"flex"} justifyContent={"center"}>
                      <Spinner color={'yellow.700'}/>
                    </Box>}
                    {!store.isLoading && store.recentQuote && <Dev>
                      <Typography variant={TVariant.ComicSans16}>Router</Typography>
                      <Box display={"flex"} justifyContent={"space-between"}>
                        <Box display={"flex"} flexDirection={"column"}>
                          <Typography variant={TVariant.ComicSans12}>
                            Cost: {formatWithThousandsSeparators(store.recentQuote.srcCurrencyAmount)} {store.recentQuote.srcCurrency}
                          </Typography>
                          <Typography variant={TVariant.ComicSans12}>
                            Fee: {formatWithThousandsSeparators(store.recentQuote.srcCurrencyFee)} {store.recentQuote.srcCurrency}
                          </Typography>
                          <Typography variant={TVariant.ComicSans12}>
                            Total: {formatWithThousandsSeparators(store.recentQuote.srcCurrencyTotal)} {store.recentQuote.srcCurrency}
                          </Typography>
                          <Typography variant={TVariant.ComicSans12}>
                            Effective
                            Rate: {formatWithThousandsSeparators(store.recentQuote.effectiveRate)} ({store.recentQuote.srcCurrency} /
                            DOG)
                          </Typography>
                        </Box>
                        <Box>
                          <Icon icon={'arrow-right'} boxSize={6}/>
                        </Box>
                        <Box>
                          <Typography variant={TVariant.ComicSans12}>
                            DOG: {store.recentQuote.dogAmount}
                          </Typography>
                        </Box>
                        <Box>
                          <Icon icon={'arrow-right'} boxSize={6}/>
                        </Box>
                        <Box>
                          <Typography variant={TVariant.ComicSans12}>
                            Pixels: {store.recentQuote.computedPixelCount}
                          </Typography>
                        </Box>
                      </Box>
                    </Dev>}
                </Box>
                <Flex justifyContent={"center"}>
                    <Submit label={"Mint"} mt={10} isDisabled={store.isLoading}/>
                </Flex>
            </Form>
        </>
    );
});

const Approval = observer(({store}: { store: MintPixelsModalStore }) => {
    return (
        <Box>
            <Box my={6}>
                {store.approveInfinite
                    ? <Flex justifyContent={"center"}>
                        <Typography display={"block"} variant={TVariant.PresStart45} lineHeight={"normal"}>
                            &infin;
                        </Typography>
                    </Flex>
                    : <Typography display={"block"} variant={TVariant.PresStart30}>
                        {formatWithThousandsSeparators(ethers.utils.formatEther(store.allowanceToGrant))}
                    </Typography>
                }
            </Box>
            <Typography block variant={TVariant.ComicSans18} mt={4}>
                Please approve $DOG to be spent for pixels.
            </Typography>
            <Form onSubmit={async () => store.pushNavigation(MintModalView.LoadingApproval)}>
                <Box mt={5}>
                    <CheckboxInput {...model(store, "approveInfinite")} label={"Approve infinite"}/>
                </Box>
                <Flex
                    flexDirection={"column"}
                    mt={14}
                    alignItems={"center"}
                >
                    <Submit label={"Approve"} flexGrow={0}/>
                    {store.showGoBack && <Button onClick={() => store.popNavigation()} mt={5}>
                      Cancel
                    </Button>}
                </Flex>
            </Form>
        </Box>
    );
});

const LoadingApproval = observer(({store}: { store: MintPixelsModalStore }) => {
    useEffect(() => {
        store.approveDogSpend()
        // eslint-disable-next-line
    }, [])
    return (
        <Box>
            <Loading
                title={"Approving..."}
                showSigningHint={!store.hasUserSignedTx}
            />
        </Box>
    )
})

const LoadingPixels = observer(({store}: { store: MintPixelsModalStore }) => {
    useEffect(() => {
        store.mintPixels(Number(store.pixelCount!))
        // eslint-disable-next-line
    }, [])
    return (
        <Box>
            <Loading
                title={"Minting..."}
                showSigningHint={!store.hasUserSignedTx}
            />
        </Box>
    );
});

const Complete = observer(({onSuccess, txHash}: { onSuccess: () => void, txHash: string | null }) => {
    return <Box>
        <Typography variant={TVariant.PresStart28} textAlign={"center"} block>
            Pixels Minted
        </Typography>
        <Typography variant={TVariant.PresStart28} textAlign={"center"} mt={4} block>
            🌟🦄💫🐸🐕🚀
        </Typography>
        <Flex justifyContent={"center"} mt={12}>
            <Button onClick={() => onSuccess()}>Go to pixels</Button>
        </Flex>
        <Flex justifyContent={"center"} mt={10}>
            {txHash && <Link href={getEtherscanURL(txHash, "tx")} isExternal>View tx</Link>}
        </Flex>
    </Box>
})

export default MintPixelsDialog

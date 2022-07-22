import React, {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {Box, Flex, Spinner, VStack} from "@chakra-ui/react";
import MintPixelsModalStore from "../../pages/Viewer/MintPixelsModal/MintPixelsModal.store";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import Form from "../../DSL/Form/Form";
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
import Icon from "../../DSL/Icon/Icon";
import Dev from "../Dev";
import {MintPixelsInput} from "./MintPixelsInput";

interface MintPixelsDialogProps {
    store: MintPixelsDialogStore;
    onSuccess: () => void;
    onGoToPixelsClick: () => void
}

const MintPixelsDialog = observer(({store, onSuccess, onGoToPixelsClick}: MintPixelsDialogProps) => {
    useEffect(() => {
        store.init()
        return () => {
            store.disposeReactions()
        }
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
        {store.currentView === MintModalView.Form && <MintForm store={store}/>}
        {store.currentView === MintModalView.VaultApproval && <VaultApproval store={store}/>}
        {store.currentView === MintModalView.LoadingVaultApproval && <LoadingVaultApproval store={store}/>}
        {store.currentView === MintModalView.CowSwap && <CowSwap store={store}/>}
        {store.currentView === MintModalView.DogApproval && <Approval store={store}/>}
        {store.currentView === MintModalView.LoadingDogApproval && <LoadingApproval store={store}/>}
        {store.currentView === MintModalView.MintPixels && <MintPixels store={store}/>}
        {store.currentView === MintModalView.Complete &&
        <Complete onSuccess={onGoToPixelsClick} txHash={store.txHash}/>}
    </>
})

const MintForm = observer(({store}: { store: MintPixelsModalStore }) => {
    return (
        <>
            <Form onSubmit={async (data) => store.handleMintSubmit(data.pixelCount)}>
                <Box mt={5}>
                    <MintPixelsInput store={store}/>
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

const VaultApproval: React.FC<{ store: MintPixelsDialogStore }> = observer(({store}) => {
    return (
        <VStack spacing={10}>
            <Typography variant={TVariant.ComicSans14}>
                You've selected to mint pixels for {store.srcCurrency}
            </Typography>
            <Typography textAlign={"center"} variant={TVariant.ComicSans14}>
                The Pixel Portal will first trade your {store.srcCurrency} to DOG ({store.recentQuote?.dogAmount}) &
                then mint - since 55,240 $DOG = 1 Pixel
            </Typography>
            <Link target={"_blank"} href={"https://docs.cow.fi/"}>Learn more here</Link>

            <Box>
                <Box my={6}>
                    {store.approveInfiniteVault
                        ? <Flex justifyContent={"center"}>
                            <Typography display={"block"} variant={TVariant.PresStart45} lineHeight={"normal"}>
                                &infin;
                            </Typography>
                        </Flex>
                        : <Typography display={"block"} variant={TVariant.PresStart30}>
                            {store.recentQuote!.srcCurrencyTotal}
                        </Typography>
                    }
                </Box>
                <Typography block variant={TVariant.ComicSans18} mt={4}>
                    Please approve {store.srcCurrency} to be spent for pixels.
                </Typography>
                <Form onSubmit={async () => store.pushNavigation(MintModalView.LoadingVaultApproval)}>
                    <Box mt={5}>
                        <CheckboxInput {...model(store, "approveInfiniteVault")} label={"Approve infinite"}/>
                    </Box>
                    <Flex
                        flexDirection={"column"}
                        mt={14}
                        alignItems={"center"}
                        justifyContent={"center"}
                    >
                        <Submit label={"Approve"} flexGrow={0}/>
                        {store.showGoBack && <Button onClick={() => store.popNavigation()} mt={5}>
                          Cancel
                        </Button>}
                    </Flex>
                </Form>
            </Box>
        </VStack>
    )
})

const Approval = observer(({store}: { store: MintPixelsModalStore }) => {
    return (
        <Box>
            <Box my={6}>
                {store.approveInfiniteDOG
                    ? <Flex justifyContent={"center"}>
                        <Typography display={"block"} variant={TVariant.PresStart45} lineHeight={"normal"}>
                            &infin;
                        </Typography>
                    </Flex>
                    : <Typography display={"block"} variant={TVariant.PresStart30}>
                        {formatWithThousandsSeparators(ethers.utils.formatEther(store.dogAllowanceToGrant))}
                    </Typography>
                }
            </Box>
            <Typography block variant={TVariant.ComicSans18} mt={4}>
                Please approve $DOG to be spent for pixels.
            </Typography>
            <Form onSubmit={async () => store.pushNavigation(MintModalView.LoadingDogApproval)}>
                <Box mt={5}>
                    <CheckboxInput {...model(store, "approveInfiniteDOG")} label={"Approve infinite"}/>
                </Box>
                <Flex
                    flexDirection={"column"}
                    mt={14}
                    alignItems={"center"}
                    justifyContent={"center"}
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

const LoadingVaultApproval: React.FC<{ store: MintPixelsDialogStore }> = observer(({store}) => {
    useEffect(() => {
        store.approveVaultSpend()
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

const MintPixels = observer(({store}: { store: MintPixelsModalStore }) => {
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

const CowSwap: React.FC<{ store: MintPixelsDialogStore }> = observer(({ store }) => {
    return (
        <Box>
            CowSwap trade lets get it
        </Box>
    )
})

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

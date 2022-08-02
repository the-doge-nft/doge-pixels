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
import jsonify from "../../helpers/jsonify";
import NewMintPixelsInput from "./NewMintPixelsInput";

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
            <Form onSubmit={() => store.handleMintSubmit()}>
                <Box mt={5}>
                    <NewMintPixelsInput store={store}/>
                </Box>
                <Flex justifyContent={"center"} mt={8}>
                    <Submit label={"Mint"} isLoading={store.isLoading} isDisabled={!store.canMint}/>
                </Flex>
            </Form>
        </>
    );
});

const VaultApproval: React.FC<{ store: MintPixelsDialogStore }> = observer(({store}) => {
    return (
        <VStack spacing={10}>
            <Box>
                <Box my={6}>
                    {store.approveInfiniteVault
                        ? <Flex justifyContent={"center"}>
                            <Typography display={"block"} variant={TVariant.PresStart45} lineHeight={"normal"}>
                                &infin;
                            </Typography>
                        </Flex>
                        : <Typography display={"block"} variant={TVariant.PresStart30}>
                            {formatWithThousandsSeparators(store.recentQuote!.srcCurrencyTotal)} {store.recentQuote?.srcCurrency}
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
                        {formatWithThousandsSeparators(ethers.utils.formatEther(store.recentQuote!._dogAmount))}
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

const CowSwap: React.FC<{ store: MintPixelsDialogStore }> = observer(({store}) => {
    return (
        <Box>
            <Typography variant={TVariant.PresStart15}>
                Time to place your trade
            </Typography>
            <Box>
                <Typography variant={TVariant.ComicSans14}>
                    {jsonify(store.cowSimpleQuote)}
                </Typography>
            </Box>
            <Button onClick={() => store.placeCowswapOrder()}>Trade!</Button>
            <Button onClick={() => store.getCowOrders()}>Get Orders</Button>
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

import { Box, Flex, HStack, useColorMode, VStack } from "@chakra-ui/react";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import Button from "../../DSL/Button/Button";
import CheckboxInput from "../../DSL/Form/CheckboxInput/CheckboxInput";
import Form from "../../DSL/Form/Form";
import model from "../../DSL/Form/model";
import Submit from "../../DSL/Form/Submit";
import Icon from "../../DSL/Icon/Icon";
import Link from "../../DSL/Link/Link";
import Loading from "../../DSL/Loading/Loading";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { getEtherscanURL } from "../../helpers/links";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";
import AppStore from "../../store/App.store";
import CowStore from "../../store/cow.store";
import SharePixelsDialog from "../SharePixelsDialog/SharePixelsDialog";
import MintPixelsDialogStore, { MintModalView } from "./MintPixelsDialog.store";
import NewMintPixelsInput from "./NewMintPixelsInput";

interface MintPixelsDialogProps {
  store: MintPixelsDialogStore;
  onSuccess: () => void;
  onGoToPixelsClick: () => void;
}

const MintPixelsDialog = observer(({ store, onSuccess, onGoToPixelsClick }: MintPixelsDialogProps) => {
  useEffect(() => {
    store.init();
    return () => {
      store.destroy();
    };
  }, []);

  useEffect(() => {
    if (store.currentView === MintModalView.Complete) {
      onSuccess && onSuccess();
      AppStore.web3.refreshPupperBalance();
      AppStore.web3.refreshDogBalance();
    }
    // eslint-disable-next-line
  }, [store.currentView]);

  return (
    <>
      {store.currentView === MintModalView.Form && <MintForm store={store} />}
      {store.currentView === MintModalView.VaultApproval && <VaultApproval store={store} />}
      {store.currentView === MintModalView.LoadingVaultApproval && <LoadingVaultApproval store={store} />}
      {store.currentView === MintModalView.CowSwap && <CowSwap store={store} />}
      {store.currentView === MintModalView.DogApproval && <DOGApproval store={store} />}
      {store.currentView === MintModalView.LoadingDogApproval && <LoadingDOGApproval store={store} />}
      {store.currentView === MintModalView.MintPixels && <MintPixels store={store} />}
      {store.currentView === MintModalView.Complete && <Complete store={store} txHash={store.txHash} />}
    </>
  );
});

const MintForm = observer(({ store }: { store: MintPixelsDialogStore }) => {
  return (
    <>
      <Form onSubmit={() => store.handleMintSubmit()}>
        <Box mt={5}>
          <NewMintPixelsInput store={store} />
        </Box>
        <Flex justifyContent={"center"} mt={8}>
          <Submit label={"Mint"} isLoading={store.isLoading} isDisabled={!store.canMint} />
        </Flex>
      </Form>
    </>
  );
});

const VaultApproval: React.FC<{ store: MintPixelsDialogStore }> = observer(({ store }) => {
  return (
    <VStack spacing={10}>
      <Box>
        <Box my={6}>
          {store.approveInfiniteVault ? (
            <Flex justifyContent={"center"}>
              <Typography display={"block"} variant={TVariant.PresStart45} lineHeight={"normal"}>
                &infin;
              </Typography>
            </Flex>
          ) : (
            <Typography display={"block"} variant={TVariant.PresStart30}>
              {formatWithThousandsSeparators(store.recentQuote!.srcCurrencyTotal)} {store.recentQuote?.srcCurrency}
            </Typography>
          )}
        </Box>
        <Typography block variant={TVariant.ComicSans18} mt={4}>
          Please approve {store.srcCurrency} to be spent for pixels.
        </Typography>
        <Form onSubmit={async () => store.pushNavigation(MintModalView.LoadingVaultApproval)}>
          <Box mt={5}>
            <CheckboxInput {...model(store, "approveInfiniteVault")} label={"Approve infinite"} />
          </Box>
          <Flex flexDirection={"column"} mt={14} alignItems={"center"} justifyContent={"center"}>
            <Submit label={"Approve"} flexGrow={0} />
            {store.showGoBack && (
              <Button onClick={() => store.popNavigation()} mt={5}>
                Cancel
              </Button>
            )}
          </Flex>
        </Form>
      </Box>
    </VStack>
  );
});

const LoadingVaultApproval: React.FC<{ store: MintPixelsDialogStore }> = observer(({ store }) => {
  useEffect(() => {
    store.approveVaultSpend();
  }, []);

  return (
    <Box>
      <Loading title={"Approving..."} showSigningHint={!store.hasUserSignedTx} />
    </Box>
  );
});

const DOGApproval = observer(({ store }: { store: MintPixelsDialogStore }) => {
  return (
    <Box>
      <Box my={6}>
        {store.approveInfiniteDOG ? (
          <Flex justifyContent={"center"}>
            <Typography display={"block"} variant={TVariant.PresStart45} lineHeight={"normal"}>
              &infin;
            </Typography>
          </Flex>
        ) : (
          <Typography display={"block"} variant={TVariant.PresStart30}>
            {formatWithThousandsSeparators(ethers.utils.formatEther(store.recentQuote!._dogAmount))}
          </Typography>
        )}
      </Box>
      <Typography block variant={TVariant.ComicSans18} mt={4}>
        Please approve DOG to be spent for pixels.
      </Typography>
      <Form onSubmit={async () => store.pushNavigation(MintModalView.LoadingDogApproval)}>
        <Box mt={5}>
          <CheckboxInput {...model(store, "approveInfiniteDOG")} label={"Approve infinite"} />
        </Box>
        <Flex flexDirection={"column"} mt={14} alignItems={"center"} justifyContent={"center"}>
          <Submit label={"Approve"} flexGrow={0} />
          {store.showGoBack && (
            <Button onClick={() => store.popNavigation()} mt={5}>
              Cancel
            </Button>
          )}
        </Flex>
      </Form>
    </Box>
  );
});

const LoadingDOGApproval = observer(({ store }: { store: MintPixelsDialogStore }) => {
  useEffect(() => {
    store.approveDogSpend();
    // eslint-disable-next-line
  }, []);
  return (
    <Box>
      <Loading title={"Approving..."} showSigningHint={!store.hasUserSignedTx} />
    </Box>
  );
});

const MintPixels = observer(({ store }: { store: MintPixelsDialogStore }) => {
  // @next TODO this flow has to change due to React 18 rendering use effects twice
  useEffect(() => {
    store.mintPixels(Number(store.pixelCount!));
    // eslint-disable-next-line
  }, []);
  return (
    <Box>
      <Loading title={"Minting..."} showSigningHint={!store.hasUserSignedTx} />
    </Box>
  );
});

const CowSwap: React.FC<{ store: MintPixelsDialogStore }> = observer(({ store }) => {
  const { colorMode } = useColorMode();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    store.placeCowswapOrder();
  }, []);
  return (
    <Box>
      <Loading title={`Swapping ${store.srcCurrency} for DOG`} showSigningHint={!store.hasUserSignedTx} />

      {store.cowSwapOrderID && (
        <Flex justifyContent="center" my={10}>
          <Link href={`${CowStore.BASE_EXPLORER_URL}/${store.cowSwapOrderID}`} isExternal>
            View Order Status
          </Link>
        </Flex>
      )}

      {store.cowSwapOrderID && (
        <Flex justifyContent={"center"}>
          <Typography variant={TVariant.ComicSans16}>(Do not close this window)</Typography>
        </Flex>
      )}

      <HStack mt={5} justifyContent={"space-between"} onClick={() => setIsOpen(!isOpen)} cursor={"pointer"}>
        <Typography variant={TVariant.PresStart10} color={colorMode === "light" ? "yellow.800" : "purple.50"}>
          Order details
        </Typography>
        <Icon
          fill={colorMode === "light" ? "yellow.800" : "purple.50"}
          color={colorMode === "light" ? "yellow.800" : "purple.50"}
          icon={isOpen ? "chevron-down" : "chevron-up"}
          boxSize={6}
        />
      </HStack>
      {isOpen && store.recentQuote && (
        <Box mt={2}>
          {store.srcCurrency !== "DOG" && (
            <>
              <Box mt={1}>
                <Flex justifyContent={"space-between"}>
                  <Typography variant={TVariant.ComicSans14} color={colorMode === "light" ? "yellow.800" : "purple.50"}>
                    Buying
                  </Typography>
                  <Typography variant={TVariant.ComicSans14} color={colorMode === "light" ? "yellow.800" : "purple.50"}>
                    {formatWithThousandsSeparators(store.recentQuote.dogAmount)} DOG
                  </Typography>
                </Flex>
                <Flex justifyContent={"space-between"}>
                  <Typography variant={TVariant.ComicSans14} color={colorMode === "light" ? "yellow.800" : "purple.50"}>
                    Selling
                  </Typography>
                  <Typography variant={TVariant.ComicSans14} color={colorMode === "light" ? "yellow.800" : "purple.50"}>
                    {formatWithThousandsSeparators(store.recentQuote.srcCurrencyAmount)} {store.srcCurrency}
                  </Typography>
                </Flex>
                <Flex justifyContent={"space-between"}>
                  <Typography variant={TVariant.ComicSans14} color={colorMode === "light" ? "yellow.800" : "purple.50"}>
                    Fees
                  </Typography>
                  <Typography variant={TVariant.ComicSans14} color={colorMode === "light" ? "yellow.800" : "purple.50"}>
                    {formatWithThousandsSeparators(store.recentQuote.srcCurrencyFee)} {store.srcCurrency}
                  </Typography>
                </Flex>
              </Box>
              <Flex alignItems={"center"} justifyContent={"flex-end"} mt={2}>
                <Icon mr={1} fill={colorMode === "light" ? "yellow.800" : "purple.50"} icon={"cowswap"} boxSize={10} />
                <Typography color={colorMode === "light" ? "yellow.800" : "purple.50"} variant={TVariant.ComicSans14}>
                  Powered by CoW Protocol
                </Typography>
              </Flex>
            </>
          )}
        </Box>
      )}
    </Box>
  );
});

const Complete = observer(({ store, txHash }: { store: MintPixelsDialogStore; txHash: string | null }) => {
  return (
    <Box>
      <Typography variant={TVariant.PresStart18} textAlign={"center"} block>
        Pixels Minted
      </Typography>
      <Typography variant={TVariant.PresStart18} textAlign={"center"} mt={4} block>
        🌟🦄💫🐸🐕🚀
      </Typography>
      <Box mt={4}>
        <SharePixelsDialog action={"mint"} previewPixels={store.diffPixels} />
        <Flex justifyContent={"center"}>
          {txHash && (
            <Link href={getEtherscanURL(txHash, "tx")} isExternal>
              View tx
            </Link>
          )}
        </Flex>
      </Box>
    </Box>
  );
});

export default MintPixelsDialog;

import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {Box, Flex, HStack, Image, VStack} from "@chakra-ui/react";
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
import NewMintPixelsInput from "./NewMintPixelsInput";
import CowLogo from "../../images/cowlogo.svg";
import Icon from "../../DSL/Icon/Icon";
import CowStore from "../../store/cow.store";

interface MintPixelsDialogProps {
  store: MintPixelsDialogStore;
  onSuccess: () => void;
  onGoToPixelsClick: () => void
}

const MintPixelsDialog = observer(({store, onSuccess, onGoToPixelsClick}: MintPixelsDialogProps) => {
  useEffect(() => {
    store.init()
    return () => {
      store.destroy()
    }
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
    {store.currentView === MintModalView.DogApproval && <DOGApproval store={store}/>}
    {store.currentView === MintModalView.LoadingDogApproval && <LoadingDOGApproval store={store}/>}
    {store.currentView === MintModalView.MintPixels && <MintPixels store={store}/>}
    {store.currentView === MintModalView.Complete &&
      <Complete onSuccess={onGoToPixelsClick} txHash={store.txHash}/>}
  </>
})

const MintForm = observer(({store}: { store: MintPixelsDialogStore }) => {
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

const DOGApproval = observer(({store}: { store: MintPixelsDialogStore }) => {
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

const LoadingDOGApproval = observer(({store}: { store: MintPixelsDialogStore }) => {
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

const MintPixels = observer(({store}: { store: MintPixelsDialogStore }) => {
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
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    store.placeCowswapOrder()
  }, [])
  return (
    <Box>
      <Loading
        title={`Swapping ${store.srcCurrency} for $DOG`}
        showSigningHint={!store.hasUserSignedTx}
      />


      {store.cowSwapOrderID &&
        <Flex justifyContent="center"><Link href={`${CowStore.BASE_EXPLORER_URL}/${store.cowSwapOrderID}`} isExternal>
          View Order Status</Link>
        </Flex>}

      <HStack mt={4} justifyContent={"space-between"} onClick={() => setIsOpen(!isOpen)}
              cursor={"pointer"}>
        <Typography variant={TVariant.PresStart10}>
          Order details
        </Typography>
        <Icon
          icon={isOpen ? "chevron-down" : "chevron-up"}
          boxSize={6}/>
      </HStack>
      {isOpen && store.recentQuote && <Box mt={2}>
        {store.srcCurrency !== "DOG" && <>
          <Box mt={4}>
            <Flex justifyContent={"space-between"}>
              <Typography
                variant={TVariant.ComicSans14}>Buying</Typography>
              <Typography
                variant={TVariant.ComicSans14}>{formatWithThousandsSeparators(store.recentQuote.dogAmount)} $DOG</Typography>
            </Flex>
            <Flex justifyContent={"space-between"}>
              <Typography
                variant={TVariant.ComicSans14}>Selling</Typography>
              <Typography
                variant={TVariant.ComicSans14}>{formatWithThousandsSeparators(store.recentQuote.srcCurrencyAmount)} {store.srcCurrency}</Typography>
            </Flex>
            <Flex justifyContent={"space-between"}>
              <Typography
                variant={TVariant.ComicSans14}>Fees</Typography>
              <Typography
                variant={TVariant.ComicSans14}>{formatWithThousandsSeparators(store.recentQuote.srcCurrencyFee)} {store.srcCurrency}</Typography>
            </Flex>
          </Box>
          <Flex alignItems={"center"} justifyContent={"flex-end"} mt={2}>
            <Image src={CowLogo} width={22} mr={1}/>
            <Typography color={"yellow.800"} variant={TVariant.ComicSans14}>Powered by Cowprotocol</Typography>
          </Flex>
        </>}
      </Box>}
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

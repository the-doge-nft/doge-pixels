import { Box, Flex, Image } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import SharePixelsDialog from "../../common/SharePixelsDialog/SharePixelsDialog";
import Button from "../../DSL/Button/Button";
import Link from "../../DSL/Link/Link";
import Loading from "../../DSL/Loading/Loading";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { getEtherscanURL } from "../../helpers/links";
import RainbowMeme from "../../images/rainbow-meme.jpg";
import AppStore from "../../store/App.store";
import RainbowClaimDialogStore, { RainbowClaimDialogView } from "./RainbowClaimDialog.store";

interface BurnPixelsDialogProps {
  store: RainbowClaimDialogStore;
}

const RainbowClaimDialog = observer(({ store }: BurnPixelsDialogProps) => {
  useEffect(() => {
    if (store.currentView === RainbowClaimDialogView.Complete) {
      AppStore.web3.refreshPupperBalance();
    }
    // eslint-disable-next-line
  }, [store.currentView]);

  return (
    <>
      {store.currentView === RainbowClaimDialogView.Claim && <ClaimPixels store={store} />}
      {store.currentView === RainbowClaimDialogView.Loading && <LoadingBurning store={store} />}
      {store.currentView === RainbowClaimDialogView.Complete && <Complete store={store} txHash={store.txHash} />}
    </>
  );
});

const ClaimPixels = observer(({ store }: { store: RainbowClaimDialogStore }) => {
  return (
    <Flex flexDirection={"column"}>
      <Image
        src={RainbowMeme}
        alt={"rainbowmeme"}
        borderWidth={"1px"}
        borderColor={"black"}
        borderStyle={"solid"}
        my={6}
      />
      <Flex justifyContent={"center"}>
        <Button onClick={() => store.claimPixel()}>Claim</Button>
      </Flex>
    </Flex>
  );
});

const LoadingBurning = observer(({ store }: { store: RainbowClaimDialogStore }) => {
  useEffect(() => {
    // store.burnSelectedPixels();
    // eslint-disable-next-line
  }, []);
  return (
    <Box>
      <Loading title={"Claiming..."} showSigningHint={!store.hasUserSignedTx} />
    </Box>
  );
});

const Complete = observer(({ store, txHash }: { store: RainbowClaimDialogStore; txHash: string | null }) => {
  return (
    <Box>
      <Typography variant={TVariant.PresStart28} textAlign={"center"} block>
        Pixel Claimed
      </Typography>
      <Typography variant={TVariant.PresStart28} textAlign={"center"} mt={4} block>
        🌈🐶🌈
      </Typography>
      <Box mt={4}>
        <SharePixelsDialog action={"claimed"} previewPixels={store.diffPixels} />
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

export default RainbowClaimDialog;

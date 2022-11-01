import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import Button, { ButtonVariant } from "../../DSL/Button/Button";
import Form from "../../DSL/Form/Form";
import Submit from "../../DSL/Form/Submit";
import Link from "../../DSL/Link/Link";
import Loading from "../../DSL/Loading/Loading";
import PixelPreview, { PixelPreviewSize } from "../../DSL/PixelPreview/PixelPreview";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { getEtherscanURL } from "../../helpers/links";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";
import BurnPixelsModalStore from "../../pages/Viewer/BurnPixelsModal/BurnPixelsModal.store";
import AppStore from "../../store/App.store";
import SharePixelsDialog from "../SharePixelsDialog/SharePixelsDialog";
import SmallUserPixels from "../SmallUserPixels";
import BurnPixelsDialogStore, { BurnPixelsModalView } from "./BurnPixelsDialog.store";

interface BurnPixelsDialogProps {
  store: BurnPixelsDialogStore;
  onSuccess?: (burnedPixelIDs: number[]) => void;
  onCompleteClose: () => void;
}

const BurnPixelsDialog = observer(({ store, onCompleteClose, onSuccess }: BurnPixelsDialogProps) => {
  useEffect(() => {
    if (store.currentView === BurnPixelsModalView.Complete) {
      onSuccess && onSuccess(store.selectedPixels);
      AppStore.web3.refreshPupperBalance();
      AppStore.web3.refreshDogBalance();
    }
    // eslint-disable-next-line
  }, [store.currentView]);

  return (
    <>
      {store.currentView === BurnPixelsModalView.Select && <SelectPixels store={store} />}
      {store.currentView === BurnPixelsModalView.LoadingBurning && <LoadingBurning store={store} />}
      {store.currentView === BurnPixelsModalView.Complete && <Complete store={store} txHash={store.txHash} />}
    </>
  );
});

const SelectPixels = observer(({ store }: { store: BurnPixelsModalStore }) => {
  const { colorMode } = useColorMode();
  return (
    <Flex flexDirection={"column"}>
      <Flex justifyContent={"center"} my={{ base: 0, md: 6 }} mb={{ base: 3, md: 6 }}>
        <PixelPreview
          size={PixelPreviewSize.sm}
          previewPixels={store.selectedPixels}
          id={"burn-pixels"}
          selectedTokenId={null}
        />
      </Flex>
      {store.isUserPixelOwner && (
        <>
          <Flex justifyContent={"center"}>
            <Flex maxH={{ base: "150px", md: "300px" }} maxW={"400px"} flexWrap={"wrap"} overflowY={"auto"}>
              <SmallUserPixels selectedPixelIds={store.selectedPixels} onClick={px => store.handlePixelSelect(px)} />
            </Flex>
          </Flex>
          <Flex justifyContent={"space-between"} alignItems={"flex-start"} mt={6}>
            <Flex flexDirection={"column"}>
              <Typography variant={TVariant.PresStart15}>DOG</Typography>
              <Typography variant={TVariant.ComicSans18}>
                {formatWithThousandsSeparators(store.selectedPixelsDogValue)}
              </Typography>
            </Flex>
            {!store.isAllPixelsSelected && (
              <Button p={0} variant={ButtonVariant.Text} onClick={() => store.selectAllPixels()}>
                Select all
              </Button>
            )}
            {store.isAllPixelsSelected && (
              <Button p={0} variant={ButtonVariant.Text} onClick={() => store.deselectAllPixels()}>
                Deselect all
              </Button>
            )}
          </Flex>
          <Flex justifyContent={"center"} mt={5} w={"full"}>
            <Box>
              <Form onSubmit={async () => store.pushNavigation(BurnPixelsModalView.LoadingBurning)}>
                <Flex justifyContent={"center"} w={"100%"}>
                  <Submit label={"Burn"} isDisabled={store.selectedPixels.length === 0} />
                </Flex>
              </Form>
            </Box>
          </Flex>
        </>
      )}
    </Flex>
  );
});

const LoadingBurning = observer(({ store }: { store: BurnPixelsModalStore }) => {
  useEffect(() => {
    store.burnSelectedPixels();
    // eslint-disable-next-line
  }, []);
  return (
    <Box>
      <Loading title={"Burning..."} showSigningHint={!store.hasUserSignedTx} />
    </Box>
  );
});

const Complete = observer(({ store, txHash }: { store: BurnPixelsDialogStore; txHash: string | null }) => {
  return (
    <Box>
      <Typography variant={TVariant.PresStart28} textAlign={"center"} block>
        Pixels Burned
      </Typography>
      <Typography variant={TVariant.PresStart28} textAlign={"center"} mt={4} block>
        🔥🔥🔥
      </Typography>
      <Box mt={4}>
        <SharePixelsDialog action={"burn"} previewPixels={store.diffPixels} />
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

export default BurnPixelsDialog;

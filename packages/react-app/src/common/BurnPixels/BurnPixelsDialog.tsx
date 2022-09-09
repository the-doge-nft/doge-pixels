import { observer } from "mobx-react-lite";
import React, {useEffect} from "react";
import BurnPixelsModalStore from "../../pages/Viewer/BurnPixelsModal/BurnPixelsModal.store";
import {Box, Flex, useColorMode} from "@chakra-ui/react";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import AppStore from "../../store/App.store";
import {darkModeSecondary, lightModePrimary} from "../../DSL/Theme";
import PixelPane from "../../DSL/PixelPane/PixelPane";
import {formatWithThousandsSeparators} from "../../helpers/numberFormatter";
import Button, {ButtonVariant} from "../../DSL/Button/Button";
import Form from "../../DSL/Form/Form";
import Submit from "../../DSL/Form/Submit";
import Loading from "../../DSL/Loading/Loading";
import BurnPixelsDialogStore, {BurnPixelsModalView} from "./BurnPixelsDialog.store";
import Link from "../../DSL/Link/Link";
import {getEtherscanURL} from "../../helpers/links";
import SharePixelsDialog from "../SharePixelsDialog/SharePixelsDialog";
import jsonify from "../../helpers/jsonify";

interface BurnPixelsDialogProps {
  store: BurnPixelsDialogStore;
  onSuccess?: (burnedPixelIDs: number[]) => void;
  onCompleteClose: () => void
}

const BurnPixelsDialog = observer(({store, onCompleteClose, onSuccess}: BurnPixelsDialogProps) => {
  useEffect(() => {
    if (store.currentView === BurnPixelsModalView.Complete) {
      onSuccess && onSuccess(store.selectedPixels)
      AppStore.web3.refreshPixelOwnershipMap()
      AppStore.web3.refreshPupperBalance()
      AppStore.web3.refreshDogBalance()
    }
    // eslint-disable-next-line
  }, [store.currentView])

  return <>
    {store.currentView === BurnPixelsModalView.Select && <SelectPixels store={store}/>}
    {store.currentView === BurnPixelsModalView.LoadingBurning && <LoadingBurning store={store}/>}
    {store.currentView === BurnPixelsModalView.Complete && <Complete store={store} txHash={store.txHash}/>}
  </>
})

const SelectPixels = observer(({store}: { store: BurnPixelsModalStore}) => {
  const {colorMode} = useColorMode()
  return <Flex flexDirection={"column"}>
    {store.isUserPixelOwner && <>
        <Flex overflow={"auto"} flexGrow={1} h={"full"} mt={6} justifyContent={"center"}>
            <Box
                maxHeight={AppStore.rwd.isMobile ? "250px" : "350px"}
                width={"416px"}
            >
              {AppStore.web3.puppersOwned.map(px => {
                const hex = AppStore.web3.pupperToHexLocal(px)
                const index = AppStore.web3.pupperToIndexLocal(px)
                const isPixelSelected = store.selectedPixels.includes(px)
                return <Box
                            mt={1}
                            mx={1}
                            p={2}
                            display={"inline-block"}
                            bg={isPixelSelected ? (colorMode === "light" ? lightModePrimary : darkModeSecondary) : "inherit"}
                            // _touch={{
                            //   bg: (colorMode === "light" ? lightModePrimary : darkModeSecondary)
                            // }}
                >
                  <PixelPane
                    showCoords
                    coordinates={AppStore.web3.pupperToPixelCoordsLocal(px)}
                    size={"sm"}
                    pupper={px}
                    color={hex}
                    pupperIndex={index}
                    onClick={() => store.handlePixelSelect(px)}
                  />
                </Box>
              })}
            </Box>
        </Flex>
        <Flex justifyContent={"space-between"} alignItems={"flex-start"} mt={12}>
            <Flex flexDirection={"column"}>
                <Typography variant={TVariant.PresStart15}>DOG</Typography>
                <Typography
                    variant={TVariant.ComicSans18}>
                  {formatWithThousandsSeparators(store.selectedPixelsDogValue)}
                </Typography>
            </Flex>
          {!store.isAllPixelsSelected &&
          <Button p={0} variant={ButtonVariant.Text} onClick={() => store.selectAllPixels()}>Select all</Button>}
          {store.isAllPixelsSelected &&
          <Button p={0} variant={ButtonVariant.Text} onClick={() => store.deselectAllPixels()}>Deselect all</Button>}
        </Flex>

        <Flex justifyContent={"center"} mt={14} w={"full"}>
            <Box>
                <Form onSubmit={async () => store.pushNavigation(BurnPixelsModalView.LoadingBurning)}>
                    <Flex justifyContent={"center"} w={"100%"}>
                        <Submit label={"Burn"} isDisabled={store.selectedPixels.length === 0}/>
                    </Flex>
                </Form>
            </Box>
        </Flex>
    </>}
  </Flex>
})

const LoadingBurning = observer(({store}: {store: BurnPixelsModalStore}) => {
  useEffect(() => {
    store.burnSelectedPixels()
    // eslint-disable-next-line
  }, [])
  return (
    <Box>
      <Loading title={"Burning..."} showSigningHint={!store.hasUserSignedTx}/>
    </Box>
  )
})

const Complete = observer(({store, txHash}: {store: BurnPixelsDialogStore, txHash: string | null}) => {
  return <Box>
    <Typography variant={TVariant.PresStart28} textAlign={"center"} block>
      Pixels Burned
    </Typography>
    <Typography variant={TVariant.PresStart28} textAlign={"center"} mt={4} block>
      🔥🔥🔥
    </Typography>
    <Flex justifyContent={"center"} mt={10}>
      {txHash && <Link href={getEtherscanURL(txHash, "tx")} isExternal>View tx</Link>}
    </Flex>
    <Box mt={4}>
      <SharePixelsDialog action={"mint"} pixelOwner={{address: AppStore.web3.address, pixels: store.diffPixelsStore.diffPixels, ens: AppStore.web3.ens}}/>
    </Box>
  </Box>
})

export default BurnPixelsDialog

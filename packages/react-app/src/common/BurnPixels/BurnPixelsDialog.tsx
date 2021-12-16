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

interface BurnPixelsDialogProps {
  store: BurnPixelsDialogStore;
  onSuccess?: () => void;
  onCompleteClose: () => void
}

const BurnPixelsDialog = observer(({store, onCompleteClose, onSuccess}: BurnPixelsDialogProps) => {
  useEffect(() => {
    if (store.currentView === BurnPixelsModalView.Complete) {
      onSuccess && onSuccess()
    }
    // eslint-disable-next-line
  }, [store.currentView])

  return <>
    {store.currentView === BurnPixelsModalView.Select && <SelectPixels store={store}/>}
    {store.currentView === BurnPixelsModalView.LoadingBurning && <LoadingBurning store={store}/>}
    {store.currentView === BurnPixelsModalView.Complete && <Complete onSuccess={onCompleteClose} />}
  </>
})

const SelectPixels = observer(({store}: { store: BurnPixelsModalStore}) => {
  const {colorMode} = useColorMode()
  return <Flex flexDirection={"column"}>

    {!store.isUserPixelOwner && <>
        <Typography variant={TVariant.ComicSans18}>
            No pixels found - try minting first!
        </Typography>
    </>}

    {store.isUserPixelOwner && <>
        <Typography variant={TVariant.ComicSans18}>
            Say goodbye to your pixels forever. Be sure to be careful with which pixels you select. You’ll most likely never
            see them again.
        </Typography>

        <Flex overflow={"scroll"} flexGrow={1} h={"full"} mt={6} justifyContent={"center"}>
            <Box maxHeight={"300px"} width={"416px"}>
              {AppStore.web3.puppersOwned.map(px => {
                const hex = AppStore.web3.pupperToHexLocal(px)
                const index = AppStore.web3.pupperToIndexLocal(px)
                const isPixelSelected = store.selectedPixels.includes(px)
                return <Box display={"inline-block"}
                            mt={2}
                            mx={1}
                            p={2}
                            bg={isPixelSelected ? (colorMode === "light" ? lightModePrimary : darkModeSecondary) : "inherit"}
                            _hover={{
                              bg: (colorMode === "light" ? lightModePrimary : darkModeSecondary)
                            }}>
                  <PixelPane
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
                <Typography variant={TVariant.PresStart15}>$DOG</Typography>
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
    <Box mt={20} mb={10}>
      <Loading title={"Burning..."} showSigningHint={!store.hasUserSignedTx}/>
    </Box>
  )
})

const Complete = observer(({onSuccess}: {onSuccess: () => void}) => {
  return <Box pt={10} pb={4}>
    <Typography variant={TVariant.PresStart28} textAlign={"center"} block>
      Pixels Burned
    </Typography>
    <Typography variant={TVariant.PresStart28} textAlign={"center"} mt={4} block>
      🔥🔥🔥
    </Typography>
    <Flex justifyContent={"center"} mt={12}>
      <Button onClick={() => onSuccess()}>Close</Button>
    </Flex>
  </Box>
})

export default BurnPixelsDialog

import { Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo } from "react";
import Modal from "../../../DSL/Modal/Modal";
import BurnPixelsModalStore, { BurnPixelsModalView } from "./BurnPixelsModal.store";
import AppStore from "../../../store/App.store";
import Typography, { TVariant } from "../../../DSL/Typography/Typography";
import Form from "../../../DSL/Form/Form";
import Submit from "../../../DSL/Form/Submit";
import PixelPane from "../../../DSL/PixelPane/PixelPane";
import Button, { ButtonVariant } from "../../../DSL/Button/Button";
import Loading from "../../../DSL/Loading/Loading";
import { formatWithThousandsSeparators } from "../../../helpers/numberFormatter";

interface BurnPixelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPixel: number | null;
  onSuccess: () =>  void;
  onCompleteClose: () => void;
}

const BurnPixelsModal = observer(({isOpen, onClose, defaultPixel, onSuccess, onCompleteClose}: BurnPixelsModalProps) => {
  const store = useMemo(() => new BurnPixelsModalStore(defaultPixel), [isOpen])

  useEffect(() => {
    if (store.currentView === BurnPixelsModalView.Complete) {
      onSuccess && onSuccess()
    }
  }, [store.currentView])

  return <Modal
    size={"lg"}
    isOpen={isOpen}
    onClose={onClose}
    title={store.modalTitle}
  >
    {store.currentView === BurnPixelsModalView.Select && <SelectPixels store={store}/>}
    {store.currentView === BurnPixelsModalView.LoadingBurning && <LoadingBurning store={store}/>}
    {store.currentView === BurnPixelsModalView.Complete && <Complete onSuccess={onCompleteClose} />}
  </Modal>
})

const SelectPixels = observer(({store}: { store: BurnPixelsModalStore}) => {
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

      <Box overflow={"scroll"} flexGrow={1} h={"full"} mt={6}>
        <Box mx={"auto"} maxHeight={"350px"} ml={3}>
          {AppStore.web3.puppersOwned.map(px => {
            const hex = AppStore.web3.pupperToHexLocal(px)
            const index = AppStore.web3.pupperToIndexLocal(px)
            const isPixelSelected = store.selectedPixels.includes(px)
            return <Box display={"inline-block"}
                        mt={2}
                        mx={1}
                        p={2}
                        bg={isPixelSelected ? "yellow.700" : "inherit"}>
              <PixelPane
                size={"md"}
                pupper={px}
                color={hex}
                pupperIndex={index}
                onClick={() => store.handlePixelSelect(px)}
              />
            </Box>
          })}
        </Box>
      </Box>
      <Flex justifyContent={"space-between"} alignItems={"center"} mt={12}>
        <Flex flexDirection={"column"}>
          <Typography variant={TVariant.PresStart14}>$DOG</Typography>
          <Typography
          variant={TVariant.PresStart14}>
        {formatWithThousandsSeparators(store.selectedPixelsDogValue)}
          </Typography>
        </Flex>
        {!store.isAllPixelsSelected &&
          <Button variant={ButtonVariant.Text} onClick={() => store.selectAllPixels()}>Select All</Button>}
        {store.isAllPixelsSelected &&
          <Button variant={ButtonVariant.Text} onClick={() => store.deselectAllPixels()}>Deselect All</Button>}
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


export default BurnPixelsModal


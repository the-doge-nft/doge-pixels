import {Box, Flex} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import Modal from "../../../DSL/Modal/Modal";
import BurnPixelsModalStore, {BurnPixelsModalView} from "./BurnPixelsModal.store";
import AppStore from "../../../store/App.store";
import {showDebugToast} from "../../../DSL/Toast/Toast";
import Typography, {TVariant} from "../../../DSL/Typography/Typography";
import Form from "../../../DSL/Form/Form";
import Submit from "../../../DSL/Form/Submit";
import PixelPane from "../../../DSL/PixelPane/PixelPane";
import Button, { ButtonVariant } from "../../../DSL/Button/Button";

interface BurnPixelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPixel: number | null
}

const BurnPixelsModal = observer(({isOpen, onClose, defaultPixel}: BurnPixelsModalProps) => {
  const store = useMemo(() => new BurnPixelsModalStore(defaultPixel), [isOpen])
  return <Modal
    size={"xl"}
    isOpen={isOpen}
    onClose={onClose}
    title={"Burn your Pixels"}
  >
    {store.currentView === BurnPixelsModalView.Select && <SelectPixels store={store} onSuccess={() => onClose()}/>}
  </Modal>
})

const SelectPixels = observer(({store, onSuccess}: {store: BurnPixelsModalStore, onSuccess: () => void}) => {
  return <Flex flexDirection={"column"}>
    <Typography variant={TVariant.ComicSans18}>
      Say goodbye to your pixels forever. Be sure to be careful with which pixels you select. You’ll most likely never see them again.
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
              size={"sm"}
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
        <Typography variant={TVariant.PresStart14}>{store.selectedPixelsDogValue / 10 ** AppStore.web3.D20_PRECISION}</Typography>
      </Flex>
      <Button variant={ButtonVariant.Text} onClick={() => store.selectAllPixels()}>Select All</Button>
    </Flex>

    <Flex justifyContent={"center"} mt={14} w={"full"}>
      <Box>
        <Form
          onSubmit={async () => {
          await store.handleSubmit()
          onSuccess()
        }}>
          <Flex justifyContent={"center"} w={"100%"}>
            <Submit label={"Burn"} isDisabled={store.selectedPixels.length === 0}/>
          </Flex>
        </Form>
      </Box>
    </Flex>
  </Flex>
})

export default BurnPixelsModal


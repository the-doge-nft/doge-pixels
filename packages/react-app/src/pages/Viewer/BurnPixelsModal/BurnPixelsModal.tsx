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
    renderHeader={() => <Typography variant={TVariant.ComicSans28}>Burn Pixels</Typography>}
  >
    {store.currentView === BurnPixelsModalView.Select && <SelectPixels store={store}/>}
  </Modal>
})

const SelectPixels = observer(({store}: {store: BurnPixelsModalStore}) => {
  return <Box>
    <Typography variant={TVariant.ComicSans14}>
      Say goodbye to your pixels forever. Be sure to be careful with which pixels you choose. You'll most likely never see them again.
    </Typography>
    <Flex flexWrap={"wrap"} justifyContent={"center"} alignItems={"center"} mt={10}>
      {AppStore.web3.tokenIdsOwned.map(px => <Flex
        m={1}
        borderStyle={"solid"}
        borderWidth={"1px"}
        borderColor={store.selectedPixels.includes(px) ? "red.500" : "yellow.50"}
        borderRadius={3}
        justifyContent={"center"}
        alignItems={"center"}
        width={"40px"}
        height={"40px"}
        bg={"yellow.700"}
        onClick={async () => {
          const [x, y] = await AppStore.web3.pupperToPixelCoords(px)
          showDebugToast(`${x.toNumber()}, ${y.toNumber()}`)
          store.handlePixelSelect(px)
          console.log("debug:: px click ", px, x.toNumber(), y.toNumber())
        }}
        _hover={{
          bg: "yellow.50",
          cursor: "pointer"
        }}
      >
        <Typography variant={TVariant.ComicSans10}>
          {px - AppStore.web3.PIXEL_TO_ID_OFFSET}
        </Typography>
      </Flex>)}
    </Flex>

    <Flex justifyContent={"center"} mt={14}>
      <Form onSubmit={async () => {
        const burntPixels = await store.handleSubmit()
        console.log("debug:: burnt pixels", burntPixels)
      }}>
        <Submit
          // disabled={store.selectedPixels.length === 0}
          // onClick={() => store.handleSubmit()}
        >
          Burn 🔥
        </Submit>
      </Form>
    </Flex>
  </Box>
})

export default BurnPixelsModal


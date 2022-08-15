import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import BurnPixelsDrawerStore from "./BurnPixelsDrawer.store";
import Drawer from "../../../DSL/Drawer/Drawer";
import BurnPixelsDialog from "../../../common/BurnPixels/BurnPixelsDialog";
import {Box, Flex} from "@chakra-ui/react";

interface BurnPixelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPixel: number | null;
  onSuccess: () =>  void;
  onCompleteClose: () => void;
  showShareModal: () => void;
}

const BurnPixelsDrawer = observer(({isOpen, onClose, defaultPixel, onSuccess, onCompleteClose, showShareModal}: BurnPixelsModalProps) => {
  const store = useMemo(() => new BurnPixelsDrawerStore(defaultPixel), [defaultPixel])
  return <Drawer
    title={store.modalTitle}
    isOpen={isOpen}
    onClose={onClose}
    description={store.description}
  >
    <Flex alignItems={"center"} flexGrow={0} width={"100%"} height={"100%"}>
      <Box width={"100%"}>
        <BurnPixelsDialog
          store={store}
          onCompleteClose={onCompleteClose}
          onSuccess={onSuccess}
          showShareModal={showShareModal}
        />
      </Box>
    </Flex>
  </Drawer>
})

export default BurnPixelsDrawer

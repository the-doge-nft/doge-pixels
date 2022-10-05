import React, { useMemo } from "react";
import { observer } from "mobx-react-lite";
import Drawer from "../../../DSL/Drawer/Drawer";
import MintPixelsDialogStore from "../../../common/MintPixels/MintPixelsDialog.store";
import MintPixelsDialog from "../../../common/MintPixels/MintPixelsDialog";
import { MintPixelsModalProps } from "../../Viewer/MintPixelsModal/MintPixelsModal";
import { Box, Flex } from "@chakra-ui/react";

interface MintPixelsDrawerProps extends MintPixelsModalProps {}

const MintPixelsDrawer = observer(({ isOpen, onClose, onSuccess, goToPixels }: MintPixelsDrawerProps) => {
  const store = useMemo(() => new MintPixelsDialogStore(), []);
  return (
    <Drawer title={store.title} isOpen={isOpen} onClose={onClose} description={store.description}>
      <Flex alignItems={"center"} h={"full"}>
        <Box width={"100%"}>
          <MintPixelsDialog store={store} onSuccess={onSuccess} onGoToPixelsClick={goToPixels} />
        </Box>
      </Flex>
    </Drawer>
  );
});

export default MintPixelsDrawer;

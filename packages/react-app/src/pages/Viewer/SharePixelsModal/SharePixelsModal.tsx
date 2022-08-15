import {observer} from "mobx-react-lite";
import Modal, {ModalProps} from "../../../DSL/Modal/Modal";
import SharePixelsDialog from "../../../common/SharePixels/SharePixelsDialog";
import { Box, Flex } from "@chakra-ui/react";
import SharePixelsDialogStore from "../../../common/SharePixels/SharePixelsDialog.store";
import { useMemo } from "react";

export interface SharePixelsModalProps extends Pick<ModalProps, "isOpen" | "onClose"> {
  isMinted: boolean
}

const SharePixelsModal = observer(({ isOpen, onClose, isMinted}: SharePixelsModalProps) => {
  const store = useMemo(() => new SharePixelsDialogStore(), [])
  return (
      <Modal
        size={"lg"}
        isOpen={isOpen}
        title={"Share"}
        onClose={onClose}
        top="200px"
        left="250px"
      >
        <Box pt={12} pb={12}>
          <SharePixelsDialog
            store={store}
            isMinted={isMinted}
            // onGoToPixelsClick={goToPixels}
          />
        </Box>
      </Modal>
  );
});

export default SharePixelsModal;

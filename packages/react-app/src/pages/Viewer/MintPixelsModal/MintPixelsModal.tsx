import {observer} from "mobx-react-lite";
import Modal, {ModalProps} from "../../../DSL/Modal/Modal";
import MintPixelsDialog from "../../../common/MintPixels/MintPixelsDialog";
import { Box } from "@chakra-ui/react";
import MintPixelsDialogStore, {MintModalView} from "../../../common/MintPixels/MintPixelsDialog.store";
import { useMemo } from "react";

export interface MintPixelsModalProps extends Pick<ModalProps, "isOpen" | "onClose"> {
  onSuccess: () => void;
  goToPixels: () => void;
}

const MintPixelsModal = observer(({ isOpen, onClose, onSuccess, goToPixels }: MintPixelsModalProps) => {
  const store = useMemo(() => new MintPixelsDialogStore(), [])
  return (
    <Modal
      size={"lg"}
      isOpen={isOpen}
      title={store.title}
      onClose={onClose}
      description={store.description}
    >
      <Box pt={store.currentView === MintModalView.Form ? 0 : 12} pb={2}>
        <MintPixelsDialog
          store={store}
          onSuccess={onSuccess}
          onGoToPixelsClick={goToPixels}/>
      </Box>
    </Modal>
  );
});

export default MintPixelsModal;

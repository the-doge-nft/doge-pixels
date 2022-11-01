import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import MintPixelsDialog from "../../../common/MintPixels/MintPixelsDialog";
import MintPixelsDialogStore from "../../../common/MintPixels/MintPixelsDialog.store";
import Modal, { ModalProps } from "../../../DSL/Modal/Modal";

export interface MintPixelsModalProps extends Pick<ModalProps, "isOpen" | "onClose"> {
  onSuccess: () => void;
  goToPixels: () => void;
}

const MintPixelsModal = observer(({ isOpen, onClose, onSuccess, goToPixels }: MintPixelsModalProps) => {
  const store = useMemo(() => new MintPixelsDialogStore(), []);
  return (
    <Modal size={"lg"} isOpen={isOpen} title={store.title} onClose={onClose} description={store.description}>
      <Box pb={2}>
        <MintPixelsDialog store={store} onSuccess={onSuccess} onGoToPixelsClick={goToPixels} />
      </Box>
    </Modal>
  );
});

export default MintPixelsModal;

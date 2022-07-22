import {observer} from "mobx-react-lite";
import {useEffect, useMemo} from "react";
import Modal, {ModalProps} from "../../../DSL/Modal/Modal";
import MintPixelsDialog from "../../../common/MintPixels/MintPixelsDialog";
import MintPixelsModalStore from "./MintPixelsModal.store";
import { Box } from "@chakra-ui/react";
import {MintModalView} from "../../../common/MintPixels/MintPixelsDialog.store";

export interface MintPixelsModalProps extends Pick<ModalProps, "isOpen" | "onClose"> {
  onSuccess: () => void;
  goToPixels: () => void;
}

const MintPixelsModal = observer(({ isOpen, onClose, onSuccess, goToPixels }: MintPixelsModalProps) => {
  const store = useMemo(() => new MintPixelsModalStore(), [])
  useEffect(() => {
    if (isOpen) {
      store.init()
    }
    // eslint-disable-next-line
  }, [])
  return (
    <Modal
      size={"lg"}
      isOpen={isOpen}
      title={store.title}
      onClose={onClose}
      description={store.description}
    >
      <Box pt={store.currentView === MintModalView.Form ? 0 : 12} pb={6}>
        <MintPixelsDialog
          store={store}
          onSuccess={onSuccess}
          onGoToPixelsClick={goToPixels}/>
      </Box>
    </Modal>
  );
});

export default MintPixelsModal;

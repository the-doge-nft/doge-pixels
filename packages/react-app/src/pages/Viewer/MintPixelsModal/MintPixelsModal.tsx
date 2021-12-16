import {observer} from "mobx-react-lite";
import {useEffect, useMemo} from "react";
import Modal, {ModalProps} from "../../../DSL/Modal/Modal";
import MintPixelsDialog from "../../../common/MintPixels/MintPixelsDialog";
import MintPixelsModalStore from "./MintPixelsModal.store";
import AppStore from "../../../store/App.store";

interface MintPixelsModalProps extends Pick<ModalProps, "isOpen" | "onClose"> {
  onSuccess: () => void;
  goToPixels: () => void;
}

const MintPixelsModal = observer(({ isOpen, onClose, onSuccess, goToPixels }: MintPixelsModalProps) => {
  const store = useMemo(() => new MintPixelsModalStore(), [])
  useEffect(() => {
    if (isOpen) {
      store.init()
    }
  }, [])
  return (
    <Modal
      size={"lg"}
      isOpen={isOpen}
      title={store.title}
      onClose={onClose}
    >
      <MintPixelsDialog
        store={store}
        onSuccess={onSuccess}
        onGoToPixelsClick={goToPixels}/>
    </Modal>
  );
});

export default MintPixelsModal;

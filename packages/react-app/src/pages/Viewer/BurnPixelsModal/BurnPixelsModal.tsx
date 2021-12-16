import {observer} from "mobx-react-lite";
import React, {useMemo} from "react";
import BurnPixelsDialog from "../../../common/BurnPixels/BurnPixelsDialog";
import Modal from "../../../DSL/Modal/Modal";
import BurnPixelsModalStore from "./BurnPixelsModal.store";

interface BurnPixelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPixel: number | null;
  onSuccess: () =>  void;
  onCompleteClose: () => void;
}

const BurnPixelsModal = observer(({isOpen, onClose, defaultPixel, onSuccess, onCompleteClose}: BurnPixelsModalProps) => {
  // eslint-disable-next-line
  const store = useMemo(() => new BurnPixelsModalStore(defaultPixel), [isOpen, defaultPixel])

  return <Modal
    size={"lg"}
    isOpen={isOpen}
    onClose={onClose}
    title={store.modalTitle}
  >
    <BurnPixelsDialog
      store={store}
      onSuccess={onSuccess}
      onCompleteClose={onCompleteClose}/>
  </Modal>
})

export default BurnPixelsModal

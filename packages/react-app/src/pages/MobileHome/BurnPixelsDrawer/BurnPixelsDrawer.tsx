import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import BurnPixelsDrawerStore from "./BurnPixelsDrawer.store";
import Drawer from "../../../DSL/Drawer/Drawer";
import BurnPixelsDialog from "../../../common/BurnPixels/BurnPixelsDialog";

interface BurnPixelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPixel: number | null;
  onSuccess: () =>  void;
  onCompleteClose: () => void;
}

const BurnPixelsDrawer = observer(({isOpen, onClose, defaultPixel, onSuccess, onCompleteClose}: BurnPixelsModalProps) => {
  const store = useMemo(() => new BurnPixelsDrawerStore(defaultPixel), [defaultPixel])
  return <Drawer
    title={store.modalTitle}
    isOpen={isOpen}
    onClose={onClose}
  >
    <BurnPixelsDialog
      store={store}
      onCompleteClose={onCompleteClose}
      onSuccess={onSuccess}
    />
  </Drawer>
})

export default BurnPixelsDrawer

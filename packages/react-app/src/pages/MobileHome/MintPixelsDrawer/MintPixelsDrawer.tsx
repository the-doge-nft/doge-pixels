import React, {useMemo} from "react";
import {observer} from "mobx-react-lite";
import Drawer from "../../../DSL/Drawer/Drawer";
import MintPixelsDialogStore from "../../../common/MintPixels/MintPixelsDialog.store";
import MintPixelsDialog from "../../../common/MintPixels/MintPixelsDialog";
import {MintPixelsModalProps} from "../../Viewer/MintPixelsModal/MintPixelsModal";

interface MintPixelsDrawer extends MintPixelsModalProps {}

const MintPixelsDrawer = observer(({isOpen, onClose, onSuccess, goToPixels}: MintPixelsDrawer) => {
  const store = useMemo(() => new MintPixelsDialogStore(), [])
  return <Drawer
    title={store.title}
    isOpen={isOpen}
    onClose={onClose}
  >
    <MintPixelsDialog
      store={store}
      onSuccess={onSuccess}
      onGoToPixelsClick={goToPixels}/>
  </Drawer>
})

export default MintPixelsDrawer

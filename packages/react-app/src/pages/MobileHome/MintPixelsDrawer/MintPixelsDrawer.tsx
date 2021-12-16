import React, { useMemo } from "react";
import {observer} from "mobx-react-lite";
import Drawer, {DrawerProps} from "../../../DSL/Drawer/Drawer";
import MintPixelsDialogStore from "../../../common/MintPixels/MintPixelsDialog.store";
import MintPixelsDialog from "../../../common/MintPixels/MintPixelsDialog";

const MintPixelsDrawer = observer(({isOpen, onClose}: Pick<DrawerProps, "isOpen" | "onClose">) => {
  const store = useMemo(() => new MintPixelsDialogStore(), [])
  return <Drawer
    title={store.title}
    isOpen={isOpen}
    onClose={onClose}
  >
    <MintPixelsDialog
      store={store}
      onSuccess={() => console.log()}
      onGoToPixelsClick={() => console.log()}/>
  </Drawer>
})

export default MintPixelsDrawer

import {observer} from "mobx-react-lite";
import {useMemo} from "react";
import PixelGeneratorDialog from "../../../common/PixelGenerator/PixelGeneratorDialog";
import Modal from "../../../DSL/Modal/Modal";
import PixelGeneratorModalStore from "./PixelGeneratorModal.store";
import {Box} from "@chakra-ui/react";
import {PixelGeneratorModalView} from "../../../common/PixelGenerator/PixelGeneratorDialog.store";

interface PixelGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (burnedPixelIDs: number[]) => void;
  onCompleteClose: () => void;
}

const PixelGeneratorModal = observer(({isOpen, onClose, onSuccess, onCompleteClose}: PixelGeneratorModalProps) => {
  // eslint-disable-next-line
  const store = useMemo(() => new PixelGeneratorModalStore(), [])

  return <Modal
    size={"lg"}
    isOpen={isOpen}
    onClose={onClose}
    // title={store.modalTitle}
    // description={store.description}
  >
    <Box pt={store.currentView === PixelGeneratorModalView.Select ? 0 : 12} pb={0} >
      <PixelGeneratorDialog
        store={store}
        onSuccess={onSuccess}
        onCompleteClose={onCompleteClose}/>
    </Box>
  </Modal>
})

export default PixelGeneratorModal

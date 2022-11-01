import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import BurnPixelsDialog from "../../../common/BurnPixels/BurnPixelsDialog";
import Modal from "../../../DSL/Modal/Modal";
import BurnPixelsModalStore from "./BurnPixelsModal.store";

interface BurnPixelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPixel: number | null;
  onSuccess: (burnedPixelIDs: number[]) => void;
  onCompleteClose: () => void;
}

const BurnPixelsModal = observer(
  ({ isOpen, onClose, defaultPixel, onSuccess, onCompleteClose }: BurnPixelsModalProps) => {
    // eslint-disable-next-line
    const store = useMemo(() => new BurnPixelsModalStore(defaultPixel), [defaultPixel]);

    return (
      <Modal isOpen={isOpen} onClose={onClose} title={store.modalTitle} description={store.description}>
        <Box>
          <BurnPixelsDialog store={store} onSuccess={onSuccess} onCompleteClose={onCompleteClose} />
        </Box>
      </Modal>
    );
  },
);

export default BurnPixelsModal;

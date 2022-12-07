import { Box } from "@chakra-ui/react";
import { Contract } from "ethers";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import Modal from "../../DSL/Modal/Modal";
import RainbowClaimDialog from "./RainbowClaimDialog";
import RainbowClaimDialogStore from "./RainbowClaimDialog.store";

export interface RainbowClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  rainbowContract: Contract;
  onSuccess?: () => void;
}

const RainbowClaimModal = observer(({ isOpen, onClose, rainbowContract, onSuccess }: RainbowClaimModalProps) => {
  // eslint-disable-next-line
  const store = useMemo(() => new RainbowClaimDialogStore(rainbowContract), [rainbowContract]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={store.title} description={store.description} size={"md"}>
      <Box>
        <RainbowClaimDialog store={store} onSuccess={onSuccess} />
      </Box>
    </Modal>
  );
});

export default RainbowClaimModal;

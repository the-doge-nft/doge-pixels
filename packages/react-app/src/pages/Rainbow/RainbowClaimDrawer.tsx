import { Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import Drawer from "../../DSL/Drawer/Drawer";
import RainbowClaimDialog from "./RainbowClaimDialog";
import RainbowClaimDialogStore from "./RainbowClaimDialog.store";
import { RainbowClaimModalProps } from "./RainbowClaimModal";

interface RainbowClaimDrawerProps extends RainbowClaimModalProps {}

const RainbowClaimDrawer = observer(({ isOpen, onClose, rainbowContract, onSuccess }: RainbowClaimDrawerProps) => {
  const store = useMemo(() => new RainbowClaimDialogStore(rainbowContract), [rainbowContract]);
  return (
    <Drawer title={store.title} isOpen={isOpen} onClose={onClose} description={store.description}>
      <Flex alignItems={"center"} h={"full"}>
        <Box width={"100%"}>
          <RainbowClaimDialog store={store} onSuccess={onSuccess} />
        </Box>
      </Flex>
    </Drawer>
  );
});

export default RainbowClaimDrawer;

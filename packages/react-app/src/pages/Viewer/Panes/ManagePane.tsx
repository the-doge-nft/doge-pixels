import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import SmallUserPixels from "../../../common/SmallUserPixels";
import { lightOrDarkMode } from "../../../DSL/Theme";
import Typography, { TVariant } from "../../../DSL/Typography/Typography";
import AppStore from "../../../store/App.store";
import ViewerStore from "../Viewer.store";

const ManagePane = observer(function ManagePane({ store }: { store: ViewerStore }) {
  const { colorMode } = useColorMode();
  return (
    <>
      <Box>
        <Box mb={1}>
          <Typography variant={TVariant.PresStart12}>Your Pixels</Typography>
          <Typography
            ml={1}
            color={lightOrDarkMode(colorMode, "yellow.100", "gray.300")}
            variant={TVariant.PresStart12}
          >
            ({AppStore.web3.puppersOwned.length})
          </Typography>
        </Box>
        <Flex maxHeight={"140px"} maxW={"224px"} flexWrap={"wrap"} overflowY={"auto"}>
          <SmallUserPixels selectedPixelIds={[store.selectedPupper]} onClick={px => store.onManagePixelClick(px)} />
        </Flex>
      </Box>
    </>
  );
});

export default ManagePane;

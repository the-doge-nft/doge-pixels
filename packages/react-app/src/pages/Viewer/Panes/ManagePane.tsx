import ViewerStore from "../Viewer.store";
import { Box, Flex, useColorMode } from "@chakra-ui/react";
import Typography, { TVariant } from "../../../DSL/Typography/Typography";
import React from "react";
import { observer } from "mobx-react-lite";
import AppStore from "../../../store/App.store";
import PixelPane from "../../../DSL/PixelPane/PixelPane";
import { darkModeSecondary, lightModePrimary, lightOrDarkMode } from "../../../DSL/Theme";
import Tooltip from "../../../DSL/Tooltip/Tooltip";

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
        <Flex maxHeight={"300px"} maxW={"300px"}>
          {AppStore.web3.puppersOwned.map(px => {
            const [x, y] = AppStore.web3.pupperToPixelCoordsLocal(px);
            return (
              <Box
                p={1}
                key={`manage-${px}`}
                _hover={{
                  bg: lightOrDarkMode(colorMode, lightModePrimary, darkModeSecondary),
                }}
              >
                <Tooltip label={`(${x}, ${y})`}>
                  <PixelPane
                    isNew={store.getIsPupperNew(px)}
                    size={"xxs"}
                    onClick={() => store.onManagePixelClick(px)}
                    pupper={px}
                  />
                </Tooltip>
              </Box>
            );
          })}
        </Flex>
      </Box>
    </>
  );
});

export default ManagePane;

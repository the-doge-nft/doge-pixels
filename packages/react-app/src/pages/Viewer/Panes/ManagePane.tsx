import ViewerStore from "../Viewer.store";
import { Box, Flex, useColorMode } from "@chakra-ui/react";
import Typography, { TVariant } from "../../../DSL/Typography/Typography";
import React from "react";
import { observer } from "mobx-react-lite";
import AppStore from "../../../store/App.store";
import PixelPane from "../../../DSL/PixelPane/PixelPane";
import MintBurnButtons from "../MintBurnButtons";
import { darkModeSecondary, lightModePrimary } from "../../../DSL/Theme";

const ManagePane = observer(function ManagePane({ store }: { store: ViewerStore }) {
  const { colorMode } = useColorMode();
  return (
    <>
      <Flex flexDirection={"column"} flexGrow={1}>
        <Typography block mb={5} variant={TVariant.PresStart16}>
          Your Pixels ({AppStore.web3.puppersOwned.length})
        </Typography>
        <Box overflow={"auto"} h={"full"} mt={3}>
          <Box maxHeight={"300px"} maxW={"300px"}>
            {AppStore.web3.puppersOwned.map(px => {
              return (
                <Box
                  p={2}
                  display={"inline-block"}
                  key={`manage-${px}`}
                  _hover={{
                    bg: colorMode === "light" ? lightModePrimary : darkModeSecondary,
                  }}
                >
                  <PixelPane
                    isNew={store.getIsPupperNew(px)}
                    size={"xs"}
                    onClick={() => store.onManagePixelClick(px)}
                    pupper={px}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>
        {/*<Box mt={10}>*/}
        {/*  <MintBurnButtons store={store} />*/}
        {/*</Box>*/}
      </Flex>
    </>
  );
});

export default ManagePane;

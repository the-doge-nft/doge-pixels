import ViewerStore from "../Viewer.store";
import {Box, Flex, useColorMode} from "@chakra-ui/react";
import Typography, {TVariant} from "../../../DSL/Typography/Typography";
import React from "react";
import {observer} from "mobx-react-lite";
import AppStore from "../../../store/App.store";
import PixelPane from "../../../DSL/PixelPane/PixelPane";
import MintBurnButtons from "../MintBurnButtons";
import {darkModeSecondary, lightModePrimary} from "../../../DSL/Theme";

const ManagePane = observer(function ManagePane({store}: {store: ViewerStore}) {
  const {colorMode} = useColorMode()
  return <>
    <Flex flexDirection={"column"} flexGrow={1}>
      <Typography
        block
        mt={1}
        mb={5}
        variant={TVariant.PresStart18}>
        Your Pixels ({AppStore.web3.puppersOwned.length})
      </Typography>
      <Box overflow={"auto"} h={"full"} mt={3}>
        <Box maxHeight={"350px"}>
          {AppStore.web3.puppersOwned.map((px) => {
            return <Box
              p={2}
              m={1}
              display={"inline-block"}
              key={`manage-${px}`}
              _hover={{
                bg: colorMode === "light" ? lightModePrimary : darkModeSecondary
              }}
            >
              <PixelPane
                isNew={store.getIsPupperNew(px)}
                size={"sm"}
                onClick={() => store.onManagePixelClick(px)}
                pupper={px}
                color={AppStore.web3.pupperToHexLocal(px)}
                pupperIndex={AppStore.web3.pupperToIndexLocal(px)}
              />
            </Box>})}
        </Box>
      </Box>
      <Box mt={10}>
        <MintBurnButtons store={store}/>
      </Box>
    </Flex>
  </>
})

export default ManagePane;

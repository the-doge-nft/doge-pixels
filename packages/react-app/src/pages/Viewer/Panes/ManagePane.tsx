import ViewerStore, {ViewerView} from "../Viewer.store";
import {Box, Flex, HStack, useColorMode} from "@chakra-ui/react";
import Typography, {TVariant} from "../../../DSL/Typography/Typography";
import React from "react";
import {observer} from "mobx-react-lite";
import AppStore from "../../../store/App.store";
import PixelPane from "../../../DSL/PixelPane/PixelPane";
import MintBurnButtons from "../MintBurnButtons";

const ManagePane = observer(function ManagePane({store}: {store: ViewerStore}) {
  return <>
    <Flex flexDirection={"column"} flexGrow={1}>
      <Typography
        block
        mt={1}
        mb={5}
        variant={TVariant.PresStart18}>
        Your Pixels ({AppStore.web3.puppersOwned.length})
      </Typography>
      <Box overflow={"scroll"} h={"full"} mt={3}>
        <Flex maxHeight={"350px"} flexWrap={"wrap"} mt={0}>
          {AppStore.web3.puppersOwned.map((px, index, arr) => {
            const [x,y] = AppStore.web3.pupperToPixelCoordsLocal(px)
            const hex = AppStore.web3.pupperToHexLocal(px)
            return <Box ml={3} mt={3}>
              <PixelPane
                onClick={async () => await store.onManagePixelClick(px)}
                pupper={px}
                color={hex}
                pupperIndex={AppStore.web3.pupperToIndexLocal(px)}
              />
            </Box>})}
        </Flex>
      </Box>
      <Box mt={10}>
        <MintBurnButtons store={store}/>
      </Box>
    </Flex>
  </>
})

export default ManagePane;

import ViewerStore, {VIEWED_PIXELS_LS_KEY, ViewerView} from "../Viewer.store";
import {Box, Flex, HStack, useColorMode} from "@chakra-ui/react";
import Typography, {TVariant} from "../../../DSL/Typography/Typography";
import React from "react";
import {observer} from "mobx-react-lite";
import AppStore from "../../../store/App.store";
import PixelPane from "../../../DSL/PixelPane/PixelPane";
import MintBurnButtons from "../MintBurnButtons";
import LocalStorage from "../../../services/local-storage";

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
        <Box maxHeight={"350px"}>
          {AppStore.web3.puppersOwned.map((px, index, arr) => {
            const [x,y] = AppStore.web3.pupperToPixelCoordsLocal(px)
            const hex = AppStore.web3.pupperToHexLocal(px)
            return <Box mt={3} mx={2} display={"inline-block"} key={`manage-${px}`}>
              <PixelPane
                isNew={store.getIsPupperNew(px)}
                size={"sm"}
                onClick={async () => await store.onManagePixelClick(px)}
                pupper={px}
                color={hex}
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

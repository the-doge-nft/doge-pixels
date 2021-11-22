import ViewerStore, {ViewerView} from "../Viewer.store";
import {Box, Flex, useColorMode} from "@chakra-ui/react";
import Typography, {TVariant} from "../../../DSL/Typography/Typography";
import React from "react";
import {observer} from "mobx-react-lite";
import AppStore from "../../../store/App.store";
import {showDebugToast} from "../../../DSL/Toast/Toast";
import {SET_CAMERA} from "../../../services/mixins/eventable";
import {lightOrDark} from "../../../DSL/Theme";
import PixelPane from "../../../DSL/PixelPane/PixelPane";

const ManagePane = observer(function ManagePane({store}: {store: ViewerStore}) {
  const {colorMode} = useColorMode()
  return <>
    <Flex flexDirection={"column"} flexGrow={1}>
      <Typography
        block
        size={"sm"}
        variant={TVariant.PresStart16}>
        Your Pixels ({AppStore.web3.tokenIdsOwned.length})
      </Typography>
      <Box overflow={"scroll"} h={"full"}>
        <Flex mt={5} maxHeight={"350px"} flexWrap={"wrap"} justifyContent={"space-between"}>
          {AppStore.web3.tokenIdsOwned.map((px, index, arr) => {
            const [x,y] = AppStore.web3.pupperToPixelCoordsLocal(px)
            const hex = AppStore.web3.pupperToHexLocal(px)
            return <PixelPane 
              onClick={async () => await store.onManagePixelClick(px)}
              pupper={px}
              color={hex}
              pupperIndex={AppStore.web3.pupperToPixelIndex(px)}
            />})}
        </Flex>
      </Box>
    </Flex>
  </>
})

export default ManagePane;

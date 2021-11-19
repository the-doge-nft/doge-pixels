import ViewerStore, {ViewerView} from "./Viewer.store";
import {Box, Button, Flex} from "@chakra-ui/react";
import Icon from "../../DSL/Icon/Icon";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import React from "react";
import {observer} from "mobx-react-lite";
import AppStore from "../../store/App.store";
import {showDebugToast} from "../../DSL/Toast/Toast";
import {SET_CAMERA} from "../../services/mixins/eventable";
import {ButtonVariant} from "../../DSL/Button/Button";

const ManagePane = observer(function ManagePane({store}: {store: ViewerStore}) {
  return <>
    <Flex flexDirection={"column"} flexGrow={1}>
      <Typography
        block
        size={"sm"}
        variant={TVariant.PresStart16}>
        Your Pixels
      </Typography>
      <Box overflow={"scroll"} h={"full"}>
        <Box mt={3} maxHeight={"350px"}>
          {AppStore.web3.tokenIdsOwned.map((px, index, arr) => {
            const [x,y] = AppStore.web3.pupperToPixelCoordsLocal(px)
            return <Flex
              p={4}
              mt={index === 0 ? 0 : 3}
              alignItems={"center"}
              _hover={{
                bg: "yellow.100",
                cursor: "pointer"
              }}
              onClick={async () => {
                //@TODO: CC fix
                const [x, y] = await AppStore.web3.pupperToPixelCoords(px)
                showDebugToast(`x: ${x}  -  y: ${y}`)
                store.selectedPupper = px
                store.publish(SET_CAMERA, [x, y])
                store.pushNavigation(ViewerView.Selected)
              }}
            >
              <Box width={"50px"} height={"50px"} border={"1px solid black"}/>
              <Typography variant={TVariant.ComicSans18} ml={4}>
                ({x}, {y})
              </Typography>
              <Typography variant={TVariant.ComicSans12} ml={4}>
                Token ID: {px}
              </Typography>
            </Flex>
          })}
        </Box>
      </Box>
    </Flex>
  </>
})

export default ManagePane;

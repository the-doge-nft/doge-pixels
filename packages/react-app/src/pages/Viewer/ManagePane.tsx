import ViewerStore from "./Viewer.store";
import {Box, Flex} from "@chakra-ui/react";
import Icon from "../../DSL/Icon/Icon";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import React from "react";
import {observer} from "mobx-react-lite";
import AppStore from "../../store/App.store";
import {showDebugToast} from "../../DSL/Toast/Toast";

const ManagePane = observer(function ManagePane({store}: {store: ViewerStore}) {
  return <>
    <Box>
      <Box>
        {store.showGoBack && <Icon
            color={"black"}
            cursor={"pointer"}
            icon={"arrow-left"}
            onClick={()=> store.popNavigation()}
        />}
      </Box>
      <Typography block size={"sm"} mt={2} variant={TVariant.PresStart16}>Manage Pixels</Typography>
      <PixelGrid />
    </Box>
  </>
})

const PixelGrid = observer(() => {
  return <Flex flexWrap={"wrap"}>
    {AppStore.web3.tokenIdsOwned.map(px => <Flex
      m={1}
      borderRadius={3}
      justifyContent={"center"}
      alignItems={"center"}
      width={"40px"}
      height={"40px"}
      bg={"yellow.700"}
      onClick={async () => {
        const [x, y] = await AppStore.web3.pupperToPixelCoords(px)
        showDebugToast(`${x.toNumber()}, ${y.toNumber()}`)
        console.log("debug:: px click ", px, x.toNumber(), y.toNumber())
      }}
      _hover={{
        bg: "yellow.50",
        cursor: "pointer"
      }}
    >
      <Typography variant={TVariant.ComicSans10}>
        {px - AppStore.web3.PIXEL_TO_ID_OFFSET}
      </Typography>
    </Flex>)}
  </Flex>
})


export default ManagePane;

import React from "react";
import {observer} from "mobx-react-lite";
import {Box} from "@chakra-ui/react";
import Icon from "../../DSL/Icon/Icon";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import ViewerStore from "./Viewer.store";

const SelectedPixelPane = observer(function SelectedPixelPane({store}: {store: ViewerStore}) {
  return <Box>
    <Box>
      {store.showGoBack && <Icon
          color={"black"}
          cursor={"pointer"}
          icon={"arrow-left"}
          onClick={()=> {
            store.popNavigation()
            store.clearPixelPosition()
          }}
      />}
    </Box>
    <Typography block size={"sm"} mt={2} variant={TVariant.PresStart16}>Selected Pixel</Typography>
    <Typography block size={"sm"} mt={2} variant={TVariant.PresStart16}>
      {store.selectedPixel?.x}, {store.selectedPixel?.y}
    </Typography>
  </Box>
})

export default SelectedPixelPane;

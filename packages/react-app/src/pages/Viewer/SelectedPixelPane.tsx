import React from "react";
import {observer} from "mobx-react-lite";
import {Box, Flex, VStack} from "@chakra-ui/react";
import Icon from "../../DSL/Icon/Icon";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import ViewerStore from "./Viewer.store";
import Button, {ButtonVariant} from "../../DSL/Button/Button";

const SelectedPixelPane = observer(function SelectedPixelPane({store}: {store: ViewerStore}) {
  return <Flex flexDirection={"column"} justifyContent={"space-between"} h={"full"}>
    <Box>
      <Box w={"250px"} h={"250px"} bg={"yellow.100"}/>
      <Typography mt={5} block variant={TVariant.ComicSans22} ml={3} fontWeight={"bold"}>
        Pixel #{store.pupperNumber}
      </Typography>
      <Box mt={5}>
        <Typography block variant={TVariant.ComicSans22} ml={3}>
          Coordinates: ({store.selectedPixelX}, {store.selectedPixelY})
        </Typography>
        <Typography block variant={TVariant.ComicSans22} ml={3}>
          HEX: {store.selectePupperHex}
        </Typography>
      </Box>
    </Box>
    <VStack spacing={9}>
      <Button>Burn</Button>
      <Button>Send</Button>
    </VStack>
  </Flex>
})

export default SelectedPixelPane;

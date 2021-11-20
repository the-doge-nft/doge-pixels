import React, {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {Box, Flex, VStack} from "@chakra-ui/react";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import ViewerStore from "./Viewer.store";
import Button from "../../DSL/Button/Button";
import AppStore from "../../store/App.store";
import jsonify from "../../helpers/jsonify";

const SelectedPixelPane = observer(function SelectedPixelPane({store}: {store: ViewerStore}) {
  return <Flex flexDirection={"column"} justifyContent={"space-between"} h={"full"}>
    <Box>
      <Box w={"250px"} h={"250px"} bg={"yellow.100"} border={"1px solid black"}/>
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
        {store.selectedURI && <Typography block variant={TVariant.ComicSans22} ml={3}>
          {jsonify(store.selectedURI)}
        </Typography>}
        {store.tokenOwner && <Typography block variant={TVariant.ComicSans14} ml={3}>
          {store.tokenOwner}
        </Typography>}
      </Box>
    </Box>
    {store.isSelectedPupperOwned &&
    <VStack spacing={9}>
      <Button onClick={() => store.isBurnModalOpen = true}>Burn</Button>
      <Button>Send</Button>
    </VStack>}
  </Flex>
})

export default SelectedPixelPane;

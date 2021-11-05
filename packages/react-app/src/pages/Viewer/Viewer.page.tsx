import React, { Suspense, useMemo } from "react";
import { Box, Flex, Grid, GridItem, useColorMode } from "@chakra-ui/react";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import Button from "../../DSL/Button/Button";
import ThreeScene from "./ThreeScene";
import ViewerStore from "./Viewer.store";
import Modal from "../../DSL/Modal/Modal";
import { observer } from "mobx-react-lite";
import Form from "../../DSL/Form/Form";
import NumberInput from "../../DSL/Form/NumberInput/NumberInput";
import Submit from "../../DSL/Form/Submit";
import { required } from "../../DSL/Form/validation";
import MintPixelsModal from "./MintPixelsModal";

const ViewerPage = observer(() => {
  const { colorMode } = useColorMode();
  const store = useMemo(() => new ViewerStore(), []);
  return (
    <>
      <Grid templateColumns={"2fr 1fr"} flexGrow={1}>
        <GridItem border={"solid 4px"} borderColor={colorMode === "light" ? "black" : "white"} mr={2}>
          <Suspense fallback={"Loading Kobosu..."}>
            <ThreeScene />
          </Suspense>
        </GridItem>
        <GridItem border={"solid 4px"} borderColor={colorMode === "light" ? "black" : "white"} ml={2}>
          <Flex p={3} color={"black"} flexDirection={"column"} justifyContent={"space-between"} h={"100%"}>
            <Box>
              <Typography variant={TVariant.Title22} mb={1} block>
                Own the Doge
              </Typography>
              <Typography variant={TVariant.Body16} block>
                The original image of Kabosu was minted as an NFT on ____ & aquired by pleasrDAO on ______ for ___ ETH.
                On ____ pleasrDAO fractionalized the image of the worlds most famous dog, allowing us to own a portion
                of the original meme. Through the use of fractional.art $DOG (an ERC-20) was was introduced. We took it
                one step further & are allowing you to swap your $DOG for an actual pixel. That right. If you want to
                actually own a pixel of the original DOGE, hit mint now.
              </Typography>
            </Box>
            <Button size={"md"} onClick={() => (store.isMintModalOpen = true)}>
              Mint Pixels
            </Button>
          </Flex>
        </GridItem>
      </Grid>
      <MintPixelsModal isOpen={store.isMintModalOpen} onClose={() => (store.isMintModalOpen = false)} />
    </>
  );
});

export default ViewerPage;

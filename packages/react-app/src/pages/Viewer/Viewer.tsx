import React, { Suspense } from "react";
import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import ThreeScene from "./ThreeScene";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import Button from "../../DSL/Button/Button";
import FiberScene from "./FiberScene";

const Viewer = () => {
  return (
    <Grid templateColumns={"2fr 1fr"} flexGrow={1}>
      <GridItem border={"solid black 4px"} mr={2}>
        {/*<ThreeScene />*/}
        <Suspense fallback={"loading doge"}>
          <FiberScene />
        </Suspense>
      </GridItem>
      <GridItem border={"solid black 4px"} ml={2}>
        <Flex p={3} color={"black"} flexDirection={"column"} justifyContent={"space-between"} h={"100%"}>
          <Box>
            <Typography variant={TVariant.Title22} mb={1} block>
              Own the Doge
            </Typography>
            <Typography variant={TVariant.Body16} block>
              The original image of Kabosu was minted as an NFT on ____ & aquired by pleasrDAO on ______ for ___ ETH. On
              ____ pleasrDAO fractionalized the image of the worlds most famous dog, allowing us to own a portion of the
              original meme. Through the use of fractional.art $DOG (an ERC-20) was was introduced. We took it one step
              further & are allowing you to swap your $DOG for an actual pixel. That right. If you want to actually own
              a pixel of the original DOGE, hit mint now.
            </Typography>
          </Box>
          <Button size={"md"}>
            <Typography variant={TVariant.Body18}>Mint Pixels</Typography>
          </Button>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Viewer;

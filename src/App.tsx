import React from 'react';
import ThreeScene from "./pages/viewer/ThreeScene";
import {Box, Flex, Grid, GridItem} from "@chakra-ui/react";
import Typography, {TVariant} from "./DSL/Typography/Typography";
import Button from "./DSL/Button/Button";

function App() {
  return (
    <Box w={"100vw"} h={"100vh"} py={3} px={8}>
        <Flex mb={3} justifyContent={"space-between"} alignItems={"center"}>
            <Typography variant={TVariant.Title28} color={"black"}>Pupper Pixel Viewer 🐕</Typography>
            <Button>Connect Wallet</Button>
        </Flex>
        <Grid templateColumns={"1fr 0.40fr"} h={"100%"}>
            <GridItem border={"solid black 4px"} mr={2}>
                <ThreeScene />
            </GridItem>
            <GridItem border={"solid black 4px"} ml={2}>
                <Flex color={"black"} p={2} flexDirection={"column"} justifyContent={"space-between"} h={"100%"}>
                    <Box>
                        <Typography variant={TVariant.Title22} mb={1} block>Own the Doge</Typography>
                        <Typography variant={TVariant.Body16} block>
                            The original image of Kabosu was minted as an NFT on ____ & aquired
                            by pleasrDAO on ______ for ___ ETH. On ____ pleasrDAO fractionalized
                            the image of the worlds most famous dog, allowing us to own a portion
                            of the original meme. Through the use of fractional.art $DOG (an ERC-20) was
                            was introduced. We took it one step further & are allowing you to swap your
                            $DOG for an actual pixel. That right. If you want to actually own a pixel of the
                            original DOGE, hit mint now.
                        </Typography>
                    </Box>
                    <Button>Mint Pixels</Button>
                </Flex>
            </GridItem>
        </Grid>
    </Box>
  );
}

export default App;

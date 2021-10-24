import React from 'react';
import ThreeScene from "./ThreeScene";
import {Box, Flex, Grid, GridItem, VStack} from "@chakra-ui/react";
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
                <Box color={"black"} p={2}>
                    <Typography variant={TVariant.Body20}>Own the Doge</Typography>
                </Box>
            </GridItem>
        </Grid>
    </Box>
  );
}

export default App;

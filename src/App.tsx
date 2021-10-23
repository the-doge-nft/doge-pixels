import React from 'react';
import ThreeScene from "./ThreeScene";
import {Box, Flex, Grid, GridItem} from "@chakra-ui/react";
import Typography, {TVariant} from "./DSL/Typography/Typography";
import Button from "./DSL/Button/Button";

function App() {
  return (
    <Box w={"100vw"} h={"100vh"} p={3}>
        <Flex mb={3} justifyContent={"space-between"}>
            <Typography variant={TVariant.Title28} color={"black"}>Pupper Pixel Viewer 🐕</Typography>
            <Button>Connect Wallet</Button>
        </Flex>
        <Grid templateColumns={"repeat(2, 1fr)"} h={"100%"}>
            <GridItem h={"100%"} border={"solid black 4px"}>
                <ThreeScene />
            </GridItem>
            <GridItem>
                <div>stuff here</div>
            </GridItem>
        </Grid>
    </Box>
  );
}

export default App;

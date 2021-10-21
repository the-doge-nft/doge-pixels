import React from 'react';
import FiberScene from "./FiberScene";
import ThreeScene from "./ThreeScene";
import {Grid, GridItem} from "@chakra-ui/react";

function App() {
  return (
    <div style={{
        width: "100vw",
        height: "100vh"
    }}>
        <Grid templateColumns={"repeat(2, 1fr)"}>
            <GridItem>
                <ThreeScene />
            </GridItem>
            <GridItem>
                <div>stuff here</div>
            </GridItem>
        </Grid>
    </div>
  );
}

export default App;

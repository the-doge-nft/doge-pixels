import ViewerStore, {ViewerView} from "../Viewer.store";
import {Box, Flex, Grid, GridItem, Link} from "@chakra-ui/react";
import Typography, {TVariant} from "../../../DSL/Typography/Typography";
import Button, {ButtonVariant} from "../../../DSL/Button/Button";
import AppStore from "../../../store/App.store";
import React from "react";
import {observer} from "mobx-react-lite";
import MintBurnButtons from "../MintBurnButtons";
import {openToEtherscanAddress} from "../../../helpers/links";

const IndexPane = observer(function IndexPane({store}: {store: ViewerStore}) {
  return  <>
    <Flex flexDirection={"column"} flexGrow={0} h={"100%"}>
      <Box overflow={"scroll"} flexGrow={1} h={"full"} mt={4}>
        <Box maxHeight={"300px"}>
          <Typography variant={TVariant.ComicSans18} block>
            Welcome to the pixel portal - your gateway to digital doge ownership.
          </Typography>
          <Typography variant={TVariant.ComicSans18} block mt={6}>
            This site has two main functions.
          </Typography>
          <Grid templateColumns={"0.1fr 1fr"} mt={2}>
            <GridItem>
              <Typography variant={TVariant.ComicSans18} block>
                1.
              </Typography>
            </GridItem>
            <GridItem>
              <Typography variant={TVariant.ComicSans18} block>
                Lock $DOG to mint pixels.
              </Typography>
            </GridItem>
            <GridItem>
              <Typography variant={TVariant.ComicSans18} block>
                2.
              </Typography>
            </GridItem>
            <GridItem>
              <Typography variant={TVariant.ComicSans18} block>
                Burn pixels to redeem their fair value in DOG (minus 1% fee for future development of pixel portal)
              </Typography>
            </GridItem>
          </Grid>

          <Typography variant={TVariant.ComicSans18} block mt={6}>
            Surely you've heard by now - $DOG is backed. 55,239.9 $DOG = 1 Pixel.
          </Typography>

          <Box mt={6}>
            <Typography variant={TVariant.ComicSans18} block>
              Total $DOG  = 16,969,696,969
            </Typography>
            <Typography variant={TVariant.ComicSans18} block>
              Total pixels =  307,200
            </Typography>
            <Typography variant={TVariant.ComicSans18} block>
              DOG / pixel = 55,239.89899
            </Typography>
          </Box>

          <Typography variant={TVariant.ComicSans18} block mt={8}>
            Its dangerous to go alone! Take <Link fontWeight={"bold"} onClick={() => openToEtherscanAddress(AppStore.web3.dogContractAddress)}>this</Link>
          </Typography>
        </Box>
      </Box>
    </Flex>
    <Box mt={10}>
      <MintBurnButtons store={store}/>
    </Box>
  </>
})

export default IndexPane;
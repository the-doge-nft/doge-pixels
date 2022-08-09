import ViewerStore from "../Viewer.store";
import {Box, Flex, Grid, GridItem} from "@chakra-ui/react";
import Typography, {TVariant} from "../../../DSL/Typography/Typography";
import AppStore from "../../../store/App.store";
import React from "react";
import {observer} from "mobx-react-lite";
import MintBurnButtons from "../MintBurnButtons";
import Link from "../../../DSL/Link/Link";
import {getEtherscanURL} from "../../../helpers/links";
import {Type} from "../../../DSL/Fonts/Fonts";

const IndexPane = observer(function IndexPane({store}: {store: ViewerStore}) {
  return  <>
    <Flex flexDirection={"column"} flexGrow={0} h={"100%"}>
      <Box overflowY={"auto"} flexGrow={1} h={"full"} mt={4}>
        <Box maxHeight={"300px"}>
          <Typography variant={TVariant.ComicSans18} block>
            Welcome to the Doge Pixel Portal - your gateway to collective ownership of <Link
              size={"lg"}
              variant={Type.ComicSans}
              href={"https://fractional.art/vaults/0xbaac2b4491727d78d2b78815144570b9f2fe8899"}
              isExternal
              fontWeight={"bold"}
          >
            The Doge NFT
          </Link>.
          </Typography>
          <Typography variant={TVariant.ComicSans18} block mt={6}>
            This site has two main functions:
          </Typography>
          <Grid templateColumns={"0.1fr 1fr"} mt={2}>
            <GridItem>
              <Typography variant={TVariant.ComicSans18} block>
                1.
              </Typography>
            </GridItem>
            <GridItem>
              <Typography variant={TVariant.ComicSans18} block>
                Lock <Link
                size={"lg"}
                variant={Type.ComicSans}
                href={"https://etherscan.io/token/0xbaac2b4491727d78d2b78815144570b9f2fe8899"}
                isExternal
                fontWeight={"bold"}
              >
                $DOG
              </Link> to mint <Link
                size={"lg"}
                variant={Type.ComicSans}
                href={"https://opensea.io/collection/doge-pixels"}
                isExternal
                fontWeight={"bold"}
              >
                Doge Pixels
              </Link>.
              </Typography>
            </GridItem>
            <GridItem>
              <Typography variant={TVariant.ComicSans18} block>
                2.
              </Typography>
            </GridItem>
            <GridItem>
              <Typography variant={TVariant.ComicSans18} block>
                Burn Doge Pixels to redeem their fair value in $DOG (minus 1% fee).
              </Typography>
            </GridItem>
          </Grid>

          <Typography variant={TVariant.ComicSans18} block mt={6}>
            $DOG is backed. 55,240 $DOG = 1 Pixel. Here's the math on that calculation:
          </Typography>

          <Box mt={6}>
            <Typography variant={TVariant.ComicSans18} block>
              Total supply of $DOG  = 16,969,696,969
            </Typography>
            <Typography variant={TVariant.ComicSans18} block>
              Total supply of Doge Pixels =  307,200
            </Typography>
            <Typography variant={TVariant.ComicSans18} block>
              $DOG / Doge Pixels = 55,239.899
            </Typography>
          </Box>
          <Box mt={6}>
            <Typography variant={TVariant.ComicSans18} block>
              Enjoy!
            </Typography>
          </Box>
        </Box>
      </Box>
    </Flex>
    <Box mt={10}>
      <MintBurnButtons store={store}/>
    </Box>
  </>
})

export default IndexPane;
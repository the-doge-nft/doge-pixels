import React from "react";
import { observer } from "mobx-react-lite";
import { Box, Flex, VStack } from "@chakra-ui/react";
import Typography, { TVariant } from "../../../DSL/Typography/Typography";
import ViewerStore from "../Viewer.store";
import Button, { ButtonVariant } from "../../../DSL/Button/Button";
import { abbreviate } from "../../../helpers/strings";
import KobosuJson from "../../../images/kobosu.json"
import PixelPane from "../../../DSL/PixelPane/PixelPane";
import {SET_CAMERA} from "../../../services/mixins/eventable";

const SelectedPixelPane = observer(function SelectedPixelPane({store}: {store: ViewerStore}) {
  return <Flex flexDirection={"column"} justifyContent={"space-between"} h={"full"}>
    <Box>
      <Box mt={4}>
        {store.selectedPupper && <PixelPane
                size={"lg"}
                pupper={store.selectedPupper}
                color={store.selectedPupperHEX}
                pupperIndex={store.selectedPupperIndex}
                variant={"shadow"}
                onClick={() => store.publish(SET_CAMERA, [store.selectedPixelX, store.selectedPixelY])}
              />}
      </Box>
      <Box mt={8}>
        <Box>
          <Typography variant={TVariant.ComicSans18} mr={2}>
            HEX:
          </Typography>
          <Typography variant={TVariant.ComicSans18}>
            {store.selectedPupperHEX}
          </Typography>
        </Box>
        <Box>
          <Typography variant={TVariant.ComicSans18} mr={2}>
            Coordinates:
          </Typography>
          <Typography variant={TVariant.ComicSans18}>
            ({store.selectedPixelX}, {store.selectedPixelY})
          </Typography>
        </Box>
        <Box>
          <Typography variant={TVariant.ComicSans18} mr={2}>
            Location:
          </Typography>
          <Typography variant={TVariant.ComicSans18}>
            {store.selectedURI?.description.pupperLocation}
          </Typography>
        </Box>
        {store.tokenOwner && <Box mt={12}>
          <Typography variant={TVariant.ComicSans18} mr={2}>
            Owned by
          </Typography>

          <Box>
            <Button variant={ButtonVariant.Text} onClick={() => window.open(`https://etherscan.io/address/${store.tokenOwner}`, "_blank")}>
              <Typography block variant={TVariant.PresStart18} mt={2}>
                {abbreviate(store.tokenOwner)}
              </Typography>
            </Button>
          </Box>
        </Box>}

        {store.openSeaLink && <Flex justifyContent={"center"} mt={6}>
          <Button variant={ButtonVariant.Text} onClick={() => window.open(`https://opensea.com`, "_blank")}>
            <Typography block variant={TVariant.PresStart18} mt={2}>
              View on Opensea
            </Typography>
          </Button>
        </Flex>}
      </Box>
    </Box>
    {store.isSelectedPupperOwned &&
    <VStack spacing={9}>
      <Button onClick={() => store.isBurnModalOpen = true}>Burn</Button>
    </VStack>}
  </Flex>
})

export default SelectedPixelPane;

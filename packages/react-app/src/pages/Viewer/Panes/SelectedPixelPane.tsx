import React from "react";
import { observer } from "mobx-react-lite";
import { Box, Flex, VStack } from "@chakra-ui/react";
import Typography, { TVariant } from "../../../DSL/Typography/Typography";
import ViewerStore from "../Viewer.store";
import Button, { ButtonVariant } from "../../../DSL/Button/Button";
import { abbreviate } from "../../../helpers/strings";
import PixelPane from "../../../DSL/PixelPane/PixelPane";
import {SET_CAMERA} from "../../../services/mixins/eventable";
import {useHistory} from "react-router-dom";
import {CameraPositionZ} from "../ThreeScene";

const SelectedPixelPane = observer(function SelectedPixelPane({store}: {store: ViewerStore}) {
  const history = useHistory()
  return <Flex flexDirection={"column"} justifyContent={"space-between"} h={"full"}>
    <Box>
      <Box mt={4}>
        {store.selectedPupper && <PixelPane
                size={"lg"}
                pupper={store.selectedPupper}
                color={store.selectedPupperHEX}
                pupperIndex={store.selectedPupperIndex}
                variant={"shadow"}
                onClick={() => store.publish(SET_CAMERA, [store.selectedPixelX, store.selectedPixelY, CameraPositionZ.medium])}
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
        {store.tokenOwner && <Box mt={12}>
          <Typography variant={TVariant.ComicSans18} mr={2}>
            Owned by
          </Typography>

          <Box>
            <Button variant={ButtonVariant.Text} onClick={() => {
              history.push({
                pathname: `/park/${store.tokenOwner}/${store.selectedPupper}`,
              })
            }}>
              <Typography block variant={TVariant.PresStart18} mt={2}>
                {store.selectedTokenOwnerDisplayName}
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
    <VStack spacing={9} mb={6}>
      <Button onClick={() => store.isBurnModalOpen = true}>Burn</Button>
    </VStack>}
  </Flex>
})

export default SelectedPixelPane;

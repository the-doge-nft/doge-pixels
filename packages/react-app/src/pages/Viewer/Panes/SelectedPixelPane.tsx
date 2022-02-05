import React from "react";
import {observer} from "mobx-react-lite";
import {Box, Flex, Image, VStack} from "@chakra-ui/react";
import Typography, {TVariant} from "../../../DSL/Typography/Typography";
import ViewerStore from "../Viewer.store";
import Button, {ButtonVariant} from "../../../DSL/Button/Button";
import PixelPane from "../../../DSL/PixelPane/PixelPane";
import {SELECT_PIXEL} from "../../../services/mixins/eventable";
import {useHistory} from "react-router-dom";
import Icon from "../../../DSL/Icon/Icon";
import AppStore from "../../../store/App.store";
import Dev from "../../../common/Dev";
import {isDevModeEnabled, isProduction} from "../../../environment/helpers";

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
              onClick={() => store.publish(SELECT_PIXEL, [store.selectedPixelX, store.selectedPixelY])}
            />}
      </Box>

      {store.metaData && <Dev>
        <Box mt={10} border={"1px dashed black"} p={3}>
          <Typography variant={TVariant.ComicSans12} fontWeight={"bold"} mb={2} block>DEBUG METADATA</Typography>
          <Typography block variant={TVariant.ComicSans12}>{store.metaData.name}</Typography>
          <Typography block variant={TVariant.ComicSans12}>{store.metaData.description}</Typography>
          {store.metaData.attributes.map(item => <Typography block variant={TVariant.ComicSans12}>{item.trait_type}: {item.value}</Typography>)}
          <Image src={store.metaData.image} height={25} widht={25}/>
        </Box>
      </Dev>}

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

          <Flex alignItems={"center"} pt={AppStore.rwd.isMobile ? 3 : 0}>
            <Icon icon={'person'} />

            {AppStore.rwd.isMobile && <Box ml={3}>
                <Typography block variant={TVariant.PresStart18}>
              {store.selectedTokenOwnerDisplayName}
            </Typography>
            </Box>}

            {!AppStore.rwd.isMobile && <Button variant={ButtonVariant.Text} onClick={() => {
              history.push({
                pathname: `/park/${store.tokenOwner}/${store.selectedPupper}`,
              })
            }}>
              <Typography block variant={TVariant.PresStart18}>
                {store.selectedTokenOwnerDisplayName}
              </Typography>
            </Button>}
          </Flex>

          <Flex justifyContent={"center"} mt={6}>
            <Button variant={ButtonVariant.Text} onClick={() => {
              let url
              if (isDevModeEnabled()) {
                url = `https://testnets.opensea.io/assets/${AppStore.web3.pxContractAddress}/${store.selectedPupper}`
              } else if (isProduction()) {
                url = `https://opensea.io/assets/${AppStore.web3.pxContractAddress}/${store.selectedPupper}`
              } else {
                throw Error("Unknown environment")
              }
              window.open(url, "_blank")
            }}>
              <Typography block variant={TVariant.PresStart18} mt={2}>
                View on Opensea
              </Typography>
            </Button>
          </Flex>
        </Box>}
      </Box>
    </Box>
    {store.isSelectedPupperOwned && !AppStore.rwd.isMobile &&
    <VStack spacing={9} mb={6}>
      <Button onClick={() => store.modals.isBurnModalOpen = true}>Burn</Button>
    </VStack>}
  </Flex>
})

export default SelectedPixelPane;

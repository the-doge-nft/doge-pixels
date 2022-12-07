import { Box, Flex, Image } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { generatePath } from "react-router-dom";
import Dev from "../../../common/Dev";
import Button from "../../../DSL/Button/Button";
import Icon from "../../../DSL/Icon/Icon";
import Link from "../../../DSL/Link/Link";
import PixelPane from "../../../DSL/PixelPane/PixelPane";
import Typography, { TVariant } from "../../../DSL/Typography/Typography";
import { isDevModeEnabled, isStaging } from "../../../environment/helpers";
import { SELECT_PIXEL } from "../../../services/mixins/eventable";
import AppStore from "../../../store/App.store";
import ViewerStore from "../Viewer.store";

const SelectedPixelPane = observer(function SelectedPixelPane({ store }: { store: ViewerStore }) {
  return (
    <Flex flexDir={"column"} gap={2}>
      <Flex flexDir={{ base: "row", md: "column" }} gap={4}>
        <Flex alignItems={"center"} gap={4}>
          {store.selectedPupper && (
            <PixelPane
              size={AppStore.rwd.isMobile ? "xs" : "md"}
              pupper={store.selectedPupper}
              onClick={() => store.publish(SELECT_PIXEL, [store.selectedPixelX, store.selectedPixelY])}
            />
          )}
          {store.isSelectedPupperOwned && !AppStore.rwd.isMobile && (
            <Box>
              <Button onClick={() => (AppStore.modals.isBurnModalOpen = true)}>Burn</Button>
            </Box>
          )}
        </Flex>
        <Box>
          <Box>
            <Typography variant={TVariant.ComicSans14} mr={2}>
              Token ID:
            </Typography>
            <Typography variant={TVariant.ComicSans14}>{store.selectedPupper}</Typography>
          </Box>
          <Box>
            <Typography variant={TVariant.ComicSans14} mr={2}>
              Index:
            </Typography>
            <Typography variant={TVariant.ComicSans14}>{store.selectedPupperIndex}</Typography>
          </Box>
          <Box>
            <Typography variant={TVariant.ComicSans14} mr={2}>
              HEX:
            </Typography>
            <Typography variant={TVariant.ComicSans14}>{store.selectedPupperHEX}</Typography>
          </Box>

          {store.metaData && (
            <Dev>
              <Box mt={10} border={"1px dashed black"} p={3}>
                <Typography variant={TVariant.ComicSans12} fontWeight={"bold"} mb={2} block>
                  DEBUG METADATA
                </Typography>
                <Typography block variant={TVariant.ComicSans12}>
                  {store.metaData.name}
                </Typography>
                <Typography block variant={TVariant.ComicSans12}>
                  {store.metaData.description}
                </Typography>
                {store.metaData.attributes?.map(item => (
                  <Typography block variant={TVariant.ComicSans12}>
                    {item.trait_type}: {item.value}
                  </Typography>
                ))}
                <Image src={store.metaData.image} height={25} width={25} />
              </Box>
            </Dev>
          )}

          {store.tokenOwner && (
            <Box mt={4}>
              <Typography variant={TVariant.ComicSans14} mr={2}>
                Owned by
              </Typography>

              <Flex justifyContent={"center"} flexDir={"column"} gap={6}>
                <Box mt={2}>
                  <Link
                    pb={1}
                    size={"sm"}
                    maxW={"200px"}
                    overflowWrap={"anywhere"}
                    overflow={"hidden"}
                    textOverflow={"ellipsis"}
                    isNav
                    to={generatePath("/leaderbork/:address/wallet/:tokenId", {
                      address: store.tokenOwner,
                      tokenId: store.selectedPupper,
                    })}
                  >
                    {store.selectedTokenOwnerDisplayName}
                  </Link>
                </Box>
              </Flex>
            </Box>
          )}
        </Box>
      </Flex>
      {store.tokenOwner && (
        <Flex justifyContent={"center"} gap={2}>
          <Link
            opacity={0.5}
            target={"_blank"}
            size={"sm"}
            href={
              isDevModeEnabled() || isStaging()
                ? `https://testnets.opensea.io/assets/${AppStore.web3.pxContractAddress}/${store.selectedPupper}`
                : `https://opensea.io/assets/${AppStore.web3.pxContractAddress}/${store.selectedPupper}`
            }
          >
            <Icon fill={"white"} icon={"openSea"} boxSize={5} />
          </Link>
          <Link
            opacity={0.5}
            target={"_blank"}
            size={"sm"}
            href={
              isDevModeEnabled() || isStaging()
                ? `https://goerli.looksrare.org/collections/${AppStore.web3.pxContractAddress}/${store.selectedPupper}`
                : `https://looksrare.org/collections/${AppStore.web3.pxContractAddress}/${store.selectedPupper}`
            }
          >
            <Icon icon={"looksRare"} boxSize={5} />
          </Link>
        </Flex>
      )}
    </Flex>
  );
});

export default SelectedPixelPane;

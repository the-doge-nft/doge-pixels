import { Box, Flex } from "@chakra-ui/react";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDisconnect } from "wagmi";
import { NamedRoutes, route } from "../../App.routes";
import SmallUserPixels from "../../common/SmallUserPixels";
import Button, { ButtonVariant, ConnectWalletButton } from "../../DSL/Button/Button";
import PixelPreview, { PixelPreviewSize } from "../../DSL/PixelPreview/PixelPreview";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";
import AppStore from "../../store/App.store";
import BurnPixelsDrawer from "./BurnPixelsDrawer/BurnPixelsDrawer";
import MintPixelsDrawer from "./MintPixelsDrawer/MintPixelsDrawer";
import MobileHomeStore from "./MobileHome.store";

const MobileHomePage = observer(() => {
  const history = useHistory();
  const store = useMemo(() => new MobileHomeStore(), []);
  const {disconnect} = useDisconnect()
  useEffect(() => {
    store.init();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!AppStore.rwd.isMobile) {
      history.push(route(NamedRoutes.VIEWER));
    }
    // eslint-disable-next-line
  }, [AppStore.rwd.isMobile]);

  return (
    <Flex flexGrow={1} px={4} mt={{ base: 14, md: 0 }}>
      {!AppStore.web3.isConnected && (
        <Flex justifyContent={"center"} alignItems={"center"} w={"full"}>
          <ConnectWalletButton />
        </Flex>
      )}
      {AppStore.web3.isConnected && (
        <Flex flexDirection={"column"} w={"full"} mt={5}>
          <Flex justifyContent={"space-around"}>
            <Flex flexDirection={"column"} alignItems={"center"}>
              <Typography variant={TVariant.PresStart24}>DOG</Typography>
              <Typography variant={TVariant.ComicSans22} mt={1} block>
                {AppStore.web3.dogBalance !== null
                  ? formatWithThousandsSeparators(ethers.utils.formatEther(AppStore.web3.dogBalance), 0)
                  : 0}
              </Typography>
            </Flex>
            <Flex flexDirection={"column"} alignItems={"center"}>
              <Typography variant={TVariant.PresStart24}>Pixels</Typography>
              <Typography variant={TVariant.ComicSans22} mt={1} block>
                {AppStore.web3.pupperBalance === 0 ? "None 😕" : AppStore.web3.pupperBalance}
              </Typography>
            </Flex>
          </Flex>

          <Flex justifyContent={"center"} flexDir={"column"} flexGrow={1}>
            <Flex justifyContent={"center"} alignItems={"center"} mt={14}>
              {store.selectedOwner && (
                <PixelPreview
                  size={PixelPreviewSize.sm}
                  id={"home-pixels"}
                  selectedTokenId={store.selectedPixel}
                  previewPixels={store.selectedOwner?.pixels}
                  onPupperClick={pupper => {
                    store.selectedPixel = pupper;
                  }}
                />
              )}
            </Flex>

            <Flex my={10} overflowY={"auto"} flexWrap={"wrap"} maxHeight={"150px"}>
              <SmallUserPixels onClick={px => (store.selectedPixel = px)} />
            </Flex>
          </Flex>

          <Box mb={10}>
            <Flex w={"full"} justifyContent={"center"} alignItems={"center"} mb={10}>
              <Button mr={3} onClick={() => (store.isMintDrawerOpen = true)}>
                Mint
              </Button>
              <Button ml={3} onClick={() => (store.isBurnDrawerOpen = true)}>
                Burn
              </Button>
            </Flex>
            <Flex justifyContent={"center"}>
              <Button
                variant={ButtonVariant.Text}
                onClick={() => {
                  disconnect()
                  AppStore.web3.disconnect();
                }}
              >
                Disconnect
              </Button>
            </Flex>
          </Box>
        </Flex>
      )}
      <Box>
        {store.isMintDrawerOpen && (
          <MintPixelsDrawer
            isOpen={store.isMintDrawerOpen}
            onClose={() => (store.isMintDrawerOpen = false)}
            onSuccess={() => console.log()}
            goToPixels={() => (store.isMintDrawerOpen = false)}
          />
        )}
        {store.isBurnDrawerOpen && (
          <BurnPixelsDrawer
            isOpen={store.isBurnDrawerOpen}
            onClose={() => (store.isBurnDrawerOpen = false)}
            onSuccess={() => console.log()}
            onCompleteClose={() => (store.isBurnDrawerOpen = false)}
            defaultPixel={null}
          />
        )}
      </Box>
    </Flex>
  );
});

export default MobileHomePage;

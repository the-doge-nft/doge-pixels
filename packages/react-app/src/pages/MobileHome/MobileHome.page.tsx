import {Box, Flex, useColorMode} from "@chakra-ui/react";
import {observer} from "mobx-react-lite";
import React, {useEffect, useMemo} from "react";
import Button, {ButtonVariant} from "../../DSL/Button/Button";
import AppStore from "../../store/App.store";
import PixelPane from "../../DSL/PixelPane/PixelPane";
import {formatWithThousandsSeparators} from "../../helpers/numberFormatter";
import {ethers} from "ethers";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import {useHistory} from "react-router-dom";
import MobileHomeStore from "./MobileHome.store";
import MintPixelsDrawer from "./MintPixelsDrawer/MintPixelsDrawer";
import BurnPixelsDrawer from "./BurnPixelsDrawer/BurnPixelsDrawer";
import {NamedRoutes, route, SELECTED_PIXEL_PARAM} from "../../App.routes";
import ParkPixels from "../../DSL/ParkPixels/ParkPixels";
import {darkModeSecondary, lightModePrimary} from "../../DSL/Theme";

const MobileHomePage = observer(() => {
  const history = useHistory()
  const store = useMemo(() => new MobileHomeStore(), [])
  useEffect(() => {
    store.init()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!AppStore.rwd.isMobile) {
      history.push(route(NamedRoutes.VIEWER))
    }
    // eslint-disable-next-line
  }, [AppStore.rwd.isMobile])

  const { colorMode } = useColorMode()

  return <Flex flexGrow={1} px={4}>
      {!AppStore.web3.web3Provider && <Flex justifyContent={"center"} alignItems={"center"} w={"full"}>
        <Button
            onClick={() => {
          AppStore.web3.connect()
        }}>
            Connect
        </Button>
      </Flex>}
    {AppStore.web3.web3Provider &&
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
                <Typography variant={TVariant.ComicSans22} mt={1} block>{AppStore.web3.pupperBalance === 0 ? "None 😕" : AppStore.web3.pupperBalance}</Typography>
            </Flex>
        </Flex>

        <Flex justifyContent={"center"} alignItems={"center"} mt={14}>
          {store.selectedOwner && <ParkPixels
              id={'home-pixels'}
              selectedTokenId={store.selectedPixel}
              previewPixels={store.selectedOwner?.pixels}
              onPupperClick={(pupper) => {
                store.selectedPixel = pupper
              }}
          />}
        </Flex>

        <Flex
            my={10}
            flexGrow={1}
            overflowY={"auto"}>
          <Flex
              w={"full"}
              h={"full"}
              maxHeight={"300px"}
              justifyContent={"center"}
              alignItems={"center"}
              flexWrap={"wrap"}
          >
              {AppStore.web3.puppersOwned.map(px => {
                const hex = AppStore.web3.pupperToHexLocal(px);
                const index = AppStore.web3.pupperToIndexLocal(px);
                return (
                    <Box
                        key={`user-dog-${px}`}
                        bg={
                          store.selectedPixel === px
                              ? colorMode === "light"
                                  ? lightModePrimary
                                  : darkModeSecondary
                              : "inherit"
                        }
                        p={2}
                        mt={0}
                        _hover={{ bg: colorMode === "light" ? lightModePrimary : darkModeSecondary }}
                    >
                      <PixelPane
                          size={"sm"}
                          key={`top_dog_${px}`}
                          pupper={px}
                          onClick={px => {
                            store.selectedPixel = px;
                          }}
                      />
                    </Box>
                );
              })}
          </Flex>
        </Flex>

        <Box mb={10}>
            <Flex w={"full"} justifyContent={"center"} alignItems={"center"} mb={10}>
                <Button
                    mr={3}
                    onClick={() => store.isMintDrawerOpen = true}>
                    Mint
                </Button>
                <Button
                    ml={3}
                    onClick={() => store.isBurnDrawerOpen = true}>
                    Burn
                </Button>
            </Flex>
            <Flex justifyContent={"center"}>
                <Button
                    variant={ButtonVariant.Text}
                    onClick={() => {
                  AppStore.web3.disconnect()
                }}>
                    Disconnect
                </Button>
            </Flex>
        </Box>
      </Flex>}
    <Box>
      {store.isMintDrawerOpen &&
      <MintPixelsDrawer
        isOpen={store.isMintDrawerOpen}
        onClose={() => store.isMintDrawerOpen = false}
        onSuccess={() => console.log()}
        goToPixels={() => store.isMintDrawerOpen = false}
      />}
      {store.isBurnDrawerOpen &&
      <BurnPixelsDrawer
        isOpen={store.isBurnDrawerOpen}
        onClose={() => store.isBurnDrawerOpen = false}
        onSuccess={() => console.log()}
        onCompleteClose={() => store.isBurnDrawerOpen = false}
        defaultPixel={null}
      />}
    </Box>
  </Flex>
})

export default MobileHomePage

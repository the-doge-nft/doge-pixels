import {Box, Flex} from "@chakra-ui/react";
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

  return <Flex flexGrow={1} px={4}>
      {!AppStore.web3.web3Provider && <Flex justifyContent={"center"} alignItems={"center"} w={"full"}>
        <Button
            onClick={() => {
          AppStore.web3.connect()
        }}>
            Connect Wallet
        </Button>
      </Flex>}
    {AppStore.web3.web3Provider &&
      <Flex flexDirection={"column"} w={"full"} mt={5}>
        <Flex justifyContent={"space-around"}>
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Typography variant={TVariant.PresStart24}>$DOG</Typography>
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
            {AppStore.web3.puppersOwned.map(pupper => {
              const hex = AppStore.web3.pupperToHexLocal(pupper)
              const index = AppStore.web3.pupperToIndexLocal(pupper)
              return <Box p={2}>
                <PixelPane
                  key={`mobile-home-pixels-${pupper}`}
                  onClick={() => history.push(route(NamedRoutes.PIXELS, {[SELECTED_PIXEL_PARAM]: pupper}))}
                  size={"md"}
                  pupper={pupper}
                  color={hex}
                  pupperIndex={index}
                />
              </Box>
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

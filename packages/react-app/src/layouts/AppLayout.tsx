import React, {useEffect, useState} from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  VStack,
  Link as ChakraLink
} from "@chakra-ui/react";
import Typography, {TVariant} from "../DSL/Typography/Typography";
import Button, {ButtonVariant} from "../DSL/Button/Button";
import {matchPath, useHistory, useLocation} from "react-router-dom";
import routes, {NamedRoutes, route} from "../App.routes";
import {web3Modal} from "../services/web3Modal";
import {showDebugToast, showErrorToast} from "../DSL/Toast/Toast";
import {observer} from "mobx-react-lite";
import AppStore from "../store/App.store";
import Dev from "../common/Dev";
import ColorModeToggle from "../DSL/ColorModeToggle/ColorModeToggle";
import {lightOrDark} from "../DSL/Theme";
import Icon from "../DSL/Icon/Icon";
import {motion} from "framer-motion";
import {formatWithThousandsSeparators} from "../helpers/numberFormatter";
import { BigNumber, ethers } from "ethers";
import Link from "../DSL/Link/Link";
import {Link as ReactRouteLink} from "react-router-dom"
import BigText from "../DSL/BigText/BigText";

interface AppLayoutProps {
  children?: any;
}

const AppLayout = observer(function AppLayout({children}: AppLayoutProps) {
  useEffect(() => {
    if (web3Modal.cachedProvider && !AppStore.web3.web3Provider?.connection) {
      AppStore.web3.connect()
    }
  }, [])

  //@TODO: there is some shit here to resolve, sometimes listeners do not connect
  useEffect(() => {
    //@ts-ignore
    if (AppStore.web3.provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        showDebugToast("accounts changed")
        window.location.reload()
      }

      const handleChainChanged = (_hexChainId: string) => {
        showDebugToast("chain changed, hard reloading")
        window.location.reload()
      }

      const handleDisconnect = (error: { code: number, message: string }) => {
        showDebugToast('disconnecting')
        AppStore.web3.disconnect()
      }
      //@ts-ignore
      AppStore.web3.provider.on('accountsChanged', handleAccountsChanged)
      //@ts-ignore
      AppStore.web3.provider.on('chainChanged', handleChainChanged)
      //@ts-ignore
      AppStore.web3.provider.on('disconnect', handleDisconnect)

      return () => {
        //@ts-ignore
        if (AppStore.web3.provider?.removeListener) {
          //@ts-ignore
          AppStore.web3.provider.removeListener('accountsChanged', handleAccountsChanged)
          //@ts-ignore
          AppStore.web3.provider.removeListener('chainChanged', handleChainChanged)
          //@ts-ignore
          AppStore.web3.provider.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [AppStore.web3.provider])

  return (
    <Flex w={"100vw"} h={"100vh"} p={{base:0, md: 8}} flexDirection={"column"}>
      <Grid
        templateColumns={{base: "1fr", lg: "0.5fr 1.5fr", xl: "1fr 1fr"}}
        templateRows={"1fr"}
        mb={10}
        display={{base: "none", md: "grid"}}
      >
        <GridItem w={"full"}>
          <Flex alignItems={"center"} mb={2}>
            <Title/>
          </Flex>
        </GridItem>
        <GridItem
          display={{base: "none", lg: "flex"}}
          alignItems={"center"}
          justifyContent={"flex-end"} w={"full"}
        >
          <Nav/>
          <Box ml={10} mr={6}>
            <ColorModeToggle/>
          </Box>
          {!AppStore.web3.web3Provider && <Button ml={8} onClick={() => {
            AppStore.web3.connect()
          }}>
              Connect Wallet
          </Button>}
          <VStack>
            {AppStore.web3.address && AppStore.web3.web3Provider &&
            <Menu>
                <MenuButton overFlow={"hidden"}>
                    <Flex alignItems={"center"} overflow={"hidden"}>
                        <Typography variant={TVariant.PresStart15}>
                          {AppStore.web3.addressForDisplay}
                        </Typography>
                        <Icon
                            boxSize={6}
                            ml={2}
                            icon={'person'}
                        />
                    </Flex>
                </MenuButton>
                <MenuList maxWidth={"fit-content"}>
                    <Balances/>
                    <MenuItem onClick={() => AppStore.web3.disconnect()}>
                        <Typography variant={TVariant.PresStart15}>Disconnect {'>'}</Typography>
                    </MenuItem>
                </MenuList>
            </Menu>}
          </VStack>
        </GridItem>
      </Grid>
      {children}
    </Flex>
  );
});

const Balances = observer(function Balances() {
  return <Grid px={3} mt={2} templateColumns={"1fr 1fr"}>
      {AppStore.web3.web3Provider && <>
        <GridItem mr={4} display={"flex"} flexDirection={"column"}>
          <Typography variant={TVariant.PresStart15}>$DOG</Typography>
          <Typography variant={TVariant.ComicSans18} mt={1} block>
            {AppStore.web3.dogBalance !== null
              ? formatWithThousandsSeparators(ethers.utils.formatEther(AppStore.web3.dogBalance), 0)
              : 0}
          </Typography>
          <Dev>
            <Flex flexDirection={"column"} border={"1px solid black"} alignItems={"center"} my={6} pb={2}>
              <Box>
                <Button
                  p={2}
                  size={"sm"}
                  variant={ButtonVariant.Text}
                  onClick={async () => {
                    try {
                      const tx = await AppStore.web3.getDogToAccount()
                      await tx.wait()
                      showDebugToast("Free $DOG aquired")
                      AppStore.web3.refreshDogBalance()
                    } catch (e) {
                      console.error(e)
                      showErrorToast("Error getting free $DOG")
                    }
                  }}
                >
                  💰
                </Button>
                <Button
                    p={2}
                    size={"sm"}
                    variant={ButtonVariant.Text}
                    onClick={async () => AppStore.web3.refreshDogBalance()}>
                  🔄
                </Button>
              </Box>
              <Typography variant={TVariant.ComicSans10}>Dev tools</Typography>
            </Flex>
          </Dev>

        </GridItem>
        <GridItem ml={4} display={"flex"} flexDirection={"column"}>
          <Typography variant={TVariant.PresStart15}>Pixels</Typography>
          <Typography variant={TVariant.ComicSans18} mt={1} block>{AppStore.web3.pupperBalance === 0 ? "None 😕" : AppStore.web3.pupperBalance}</Typography>
          <Dev>
              <Flex flexDirection={"column"} border={"1px solid black"} alignItems={"center"} my={6} pb={2}>
                <Button p={2} size={"sm"} variant={ButtonVariant.Text}
                      onClick={async () => AppStore.web3.refreshPupperBalance()}>🔄</Button>
                <Typography variant={TVariant.ComicSans10}>Dev tools</Typography>
              </Flex>
          </Dev>
        </GridItem>
      </>}
    </Grid>
})

const Nav = () => {
  const location = useLocation();

  return <HStack spacing={8}>
    {routes.map((route) => {
      let path = route.path
      if (route.name === NamedRoutes.DOG_PARK) {
        if (AppStore.web3.address) {
          path = `/park/${AppStore.web3.address}`
        } else {
          path = '/park'
        }
      }
      const match = matchPath(location.pathname, {
        path: route.path,
        exact: true,
        strict: false
      })
      return (
        <Link key={route.path} to={path} isNav textDecoration={match ? "underline" : "none"}>
          {route.title}
        </Link>
      );
    })}
  </HStack>
}


const Title = () => {
  const history = useHistory()
  const {colorMode} = useColorMode()
  const [rotation, setRotation] = useState(0)
  return <Box
      _hover={{
        cursor: "pointer"
      }}
      _active={{
        transform: "translate(4px, 4px)"
      }}
      onClick={() => {
        setRotation(rotation + 360)
        history.push(route(NamedRoutes.VIEWER))
      }}
      w={"full"}
      userSelect={"none"}
    >
      <BigText size={"sm"}>
        PUPPER PIXEL PORTAL
      </BigText>
    </Box>
}

export default AppLayout;
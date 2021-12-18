import React, {useEffect} from "react";
import {Box, Flex, Grid, GridItem, HStack, useColorMode, VStack} from "@chakra-ui/react";
import Button from "../DSL/Button/Button";
import {matchPath, useHistory, useLocation} from "react-router-dom";
import routes, {NamedRoutes, route} from "../App.routes";
import {web3Modal} from "../services/web3Modal";
import {showDebugToast} from "../DSL/Toast/Toast";
import {observer} from "mobx-react-lite";
import AppStore from "../store/App.store";
import ColorModeToggle from "../DSL/ColorModeToggle/ColorModeToggle";
import Link from "../DSL/Link/Link";
import BigText from "../DSL/BigText/BigText";
import UserMenu from "./UserMenu";

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
    // eslint-disable-next-line
  }, [AppStore.web3.provider])

  return (
    <>
    <Flex
      w={"100vw"}
      h={"100vh"}
      p={{base:0, md: 8}}
      flexDirection={"column"}
    >
      <Grid
        templateColumns={{base: "1fr", md: "1fr 0.5fr 0.5fr", lg: "1fr 1fr 0.5fr", xl: "1.5fr 1fr 0.5fr"}}
        mb={10}
        templateRows={"1fr"}
        display={{base: "none", md: "grid"}}
      >
        <GridItem w={"full"}>
          <Flex alignItems={"center"} mb={2}>
            <Title/>
          </Flex>
        </GridItem>
        <GridItem>
          <Flex w={"full"} h={"full"} alignItems={"center"} justifyContent={"center"}>
            <Nav/>
          </Flex>
        </GridItem>
        <GridItem
          display={{base: "none", md: "flex"}}
          alignItems={"center"}
          justifyContent={"flex-end"}
          w={"full"}
        >
          <Flex ml={10} mr={6}>
            <ColorModeToggle/>
          </Flex>
          {!AppStore.web3.web3Provider && <Button ml={8} onClick={() => {
            AppStore.web3.connect()
          }}>
              Connect Wallet
          </Button>}
          <VStack>
            {AppStore.web3.address && AppStore.web3.web3Provider &&
            <UserMenu />}
          </VStack>
        </GridItem>
      </Grid>
      {children}
      {AppStore.rwd.isMobile && <MobileNav/>}
    </Flex>
    </>
  );
});

const Nav = () => {
  const location = useLocation();
  return <HStack spacing={12}>
    {routes.map((route) => {
      if (route.showOnDesktop) {
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
          <Link
            isNav
            key={`desktop-nav-${route.path}`}
            to={path}
            textDecoration={match ? "underline" : "none"}
          >
            {route.desktopName}
          </Link>
        );
      } else return null
    })}
  </HStack>
}

const MobileNav = () => {
  const location = useLocation()
  const { colorMode } = useColorMode()
  return <Flex
    bottom={0}
    zIndex={3}
    height={"100px"}
    bg={colorMode === "light" ? "yellow.50" : "purple.700"}
    alignItems={"center"}
    justifyContent={"space-around"}
    borderTopStyle={"solid"}
    borderTopWidth={"1px"}
    borderTopColor={colorMode === "light" ? "black" : "white"}
  >
    {routes.map((route) => {
      if (route.showOnMobile) {
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
          <Link
            isNav
            to={path}
            size={"lg"}
            fontSize={"18px"}
            key={`mobile-nav-${route.path}`}
            textDecoration={match ? "underline" : "none"}
          >
            {route.mobileName}
          </Link>
        );
      } else return null
    })}
  </Flex>
}

const Title = () => {
  const history = useHistory()
  return <Box
      _hover={{
        cursor: "pointer"
      }}
      _active={{
        transform: "translate(4px, 4px)"
      }}
      onClick={() => {
        history.push(route(NamedRoutes.VIEWER));
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



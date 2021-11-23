import React, {useEffect} from "react";
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
  VStack
} from "@chakra-ui/react";
import Typography, {TVariant} from "../DSL/Typography/Typography";
import Button, {ButtonVariant} from "../DSL/Button/Button";
import {useHistory, useLocation} from "react-router-dom";
import routes from "../App.routes";
import {web3Modal} from "../services/web3Modal";
import {showDebugToast, showErrorToast} from "../DSL/Toast/Toast";
import {observer} from "mobx-react-lite";
import AppStore from "../store/App.store";
import Dev from "../common/Dev";
import ColorModeToggle from "../DSL/ColorModeToggle/ColorModeToggle";
import {lightOrDark} from "../DSL/Theme";

interface AppLayoutProps {
  children?: any;
}

const AppLayout = observer(function AppLayout({children}: AppLayoutProps) {
  useEffect(() => {
    if (web3Modal.cachedProvider && !AppStore.web3.web3Provider?.connection) {
      AppStore.web3.connect()
    }
  }, [])

  useEffect(() => {
    //@ts-ignore
    if (AppStore.web3.provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        AppStore.web3.handleAccountsChanged(accounts)
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
      <Flex mb={5} justifyContent={"space-between"} alignItems={"center"} display={{base: "none", md: "flex"}}>
        <Flex alignItems={"center"} mb={2}>
          <Title/>
        </Flex>
        <Flex alignItems={"center"}>
          <Nav/>
          <Box mx={5}>
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
                  <MenuButton>
                      <Typography variant={TVariant.PresStart12}>
                        {AppStore.web3.addressForDisplay}
                      </Typography>
                  </MenuButton>
                  <MenuList>
                    <Balances/>
                    {/*<MenuItem onClick={() => {*/}
                    {/*  */}
                    {/*}}>*/}
                    {/*      <Typography variant={TVariant.PresStart12}>My Pixels</Typography>*/}
                    {/*</MenuItem>*/}
                    <MenuItem onClick={() => AppStore.web3.disconnect()}>
                      <Typography variant={TVariant.PresStart12}>Disconnect</Typography>
                    </MenuItem>
                  </MenuList>
                </Menu>}
          </VStack>
        </Flex>
      </Flex>
      {children}
    </Flex>
  );
});

const Balances = observer(function DevTools() {
  return <Grid px={3} mt={2} templateColumns={"1fr 1fr"}>
      {AppStore.web3.web3Provider && <>
        <GridItem mr={2} display={"flex"} flexDirection={"column"}>
          <Typography variant={TVariant.PresStart14}>$DOG</Typography>
          <Typography variant={TVariant.ComicSans18} mt={1} block>
            {AppStore.web3.dogBalance !== undefined ? AppStore.web3.dogBalance / (10 ** AppStore.web3.D20_PRECISION) : 0}
          </Typography>
          <Dev>
            <Flex flexDirection={"column"} border={"1px solid black"} alignItems={"center"} my={6} pb={2}>
              <Box>
                <Button
                  variant={ButtonVariant.Text}
                  onClick={async () => {
                    try {
                      const tx = await AppStore.web3.getDogToAccount()
                      await tx.wait()
                      showErrorToast("Getting some $DOG")
                      AppStore.web3.refreshDogBalance()
                    } catch (e) {
                      console.error(e)
                      showErrorToast("Error getting free D20")
                    }
                  }}
                >
                  💰
                </Button>
                <Button variant={ButtonVariant.Text} onClick={async () => AppStore.web3.refreshDogBalance()}>
                  🔄
                </Button>
              </Box>
              <Typography variant={TVariant.ComicSans10}>Dev tools</Typography>
            </Flex>
          </Dev>

        </GridItem>
        <GridItem ml={2} display={"flex"} flexDirection={"column"}>
          <Typography variant={TVariant.PresStart14}>$PX</Typography>
          <Typography variant={TVariant.ComicSans18} mt={1} block>{AppStore.web3.pupperBalance === 0 ? "None 😕" : AppStore.web3.pupperBalance}</Typography>
          <Dev>
              <Flex flexDirection={"column"} border={"1px solid black"} alignItems={"center"} my={6} pb={2}>
                <Button variant={ButtonVariant.Text}
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
  const history = useHistory();

  return <HStack spacing={2}>
    {routes.map((route, index) => {
      const isActive = location.pathname === route.path;
      return (
        <Button
          key={`${route}-${index}`}
          variant={ButtonVariant.Text}
          textDecoration={isActive ? "underline" : "none"}
          onClick={() => history.push(route.path)}
        >
          {route.title}
        </Button>
      );
    })}
  </HStack>
}

const Title = () => {
  const {colorMode} = useColorMode()
  return <Flex alignItems={"center"}>
      <Typography
        variant={TVariant.PresStart28}
        mr={1}
        color={"yellow.700"}
        zIndex={1}
        textShadow={"4px 4px 0px black"}
        //@ts-ignore
        sx={{"-webkit-text-stroke": lightOrDark(colorMode, "1px black", "1px white")}}
      >
        PUPPER PIXEL PORTAL
      </Typography>
    <Typography variant={TVariant.PresStart28} ml={2} pb={"5px"}>🐕</Typography>
  </Flex>
}

export default AppLayout;
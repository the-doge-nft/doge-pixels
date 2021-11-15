import React, {useEffect} from "react";
import {Box, Flex, HStack, useColorMode, VStack} from "@chakra-ui/react";
import Typography, {TVariant} from "../DSL/Typography/Typography";
import Button, {ButtonVariant} from "../DSL/Button/Button";
import {useHistory, useLocation} from "react-router-dom";
import routes from "../App.routes";
import {web3Modal} from "../services/web3Modal";
import {showDebugToast} from "../DSL/Toast/Toast";
import {observer} from "mobx-react-lite";
import AppStore from "../store/App.store";
import Dev from "../common/Dev";
import ColorModeToggle from "../DSL/ColorModeToggle/ColorModeToggle";
import {lightOrDark} from "../DSL/Theme";

interface AppLayoutProps {
  children?: any;
}

const AppLayout = observer(function AppLayout({children}: AppLayoutProps) {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (web3Modal.cachedProvider && !AppStore.web3.web3Provider?.connection) {
      AppStore.web3.connect()
    }
  }, [])

  useEffect(() => {
    //@ts-ignore
    if (AppStore.web3.provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        showDebugToast("accounts changed")
        AppStore.web3.address = accounts[0]
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
    <Flex w={"100vw"} h={"100vh"} p={8} direction={"column"}>
      <Flex mb={5} justifyContent={"space-between"} alignItems={"center"}>
        <Flex alignItems={"center"} mb={2}>
          <Title/>
        </Flex>
        <Flex alignItems={"center"}>
          <HStack spacing={2}>
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

          <Box ml={3}>
            <ColorModeToggle/>
          </Box>

          {AppStore.web3.web3Provider && <Button ml={5} onClick={() => {
            AppStore.web3.disconnect()
          }}>
              Disconnect
          </Button>}

          {!AppStore.web3.web3Provider && <Button ml={8} onClick={() => {
            AppStore.web3.connect()
          }}>
              Connect Wallet
          </Button>}
          <VStack ml={12}>
            {AppStore.web3.address &&
            <Typography variant={TVariant.PresStart14}>{AppStore.web3.addressForDisplay}</Typography>}
            <Dev>
              {AppStore.web3.web3Provider && <HStack>
                  <VStack mr={1}>
                      <Typography variant={TVariant.ComicSans14}>$DOG</Typography>
                      <Typography variant={TVariant.PresStart14}>{AppStore.web3.dogBalance}</Typography>
                      <Box>
                          <Button
                              variant={ButtonVariant.Text}
                              onClick={async () => {
                                const tx = await AppStore.web3.getDogToAccount()
                                await tx.wait()
                                AppStore.web3.refreshDogBalance()
                              }}
                          >
                              💰
                          </Button>
                          <Button variant={ButtonVariant.Text} onClick={async () => AppStore.web3.refreshDogBalance()}>
                              🔄
                          </Button>
                      </Box>
                  </VStack>
                  <VStack ml={1}>
                      <Typography variant={TVariant.ComicSans14}>$PX</Typography>
                      <Typography variant={TVariant.PresStart14}>{AppStore.web3.pupperBalance}</Typography>
                      <Box>
                          <Button variant={ButtonVariant.Text}
                                  onClick={async () => AppStore.web3.refreshPupperBalance()}>🔄</Button>
                      </Box>
                  </VStack>
              </HStack>}
            </Dev>
          </VStack>
        </Flex>
      </Flex>
      {children}
    </Flex>
  );
});

const Title = () => {
  const {colorMode} = useColorMode()
  return <Flex alignItems={"center"}>
    <Box position={"relative"} zIndex={0}>
      <Typography
        variant={TVariant.PresStart28}
        mr={1}
        color={"yellow.700"}
        zIndex={1}
        //@ts-ignore
        sx={{"-webkit-text-stroke": lightOrDark(colorMode, "1px black", "1px white")}}
      >
        PUPPER PIXEL PORTAL
      </Typography>
      <Typography
        position={"absolute"}
        left={-1}
        top={1}
        color={lightOrDark(colorMode, "black", "white")}
        zIndex={-1}
        variant={TVariant.PresStart28}>
        PUPPER PIXEL PORTAL
      </Typography>
    </Box>
    <Typography variant={TVariant.PresStart28} ml={2} pb={"5px"}>🐕</Typography>
  </Flex>
}

export default AppLayout;
import React, {useCallback, useEffect, useState} from "react";
import {Box, Flex, HStack, VStack, useColorMode} from "@chakra-ui/react";
import Typography, {TVariant} from "../DSL/Typography/Typography";
import Button, {ButtonVariant} from "../DSL/Button/Button";
import {useHistory, useLocation} from "react-router-dom";
import routes from "../App.routes";
import {web3Modal} from "../services/web3Modal";
import Icon from "../DSL/Icon/Icon";
import {showDebugToast} from "../DSL/Toast/Toast";
import {observer} from "mobx-react-lite";
import AppStore from "../store/App.store";
import Pane from "../DSL/Pane/Pane";
import Dev from "../common/Dev";

interface AppLayoutProps {
  children?: any;
}

const AppLayout = observer(function AppLayout({children}: AppLayoutProps) {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (web3Modal.cachedProvider) {
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
          <Box bg={"yellow.700"} py={3} px={5} boxShadow={"11px 11px 0px black"}>
            <Box position={"relative"} zIndex={0}>
              <Typography
                variant={TVariant.PresStart28}
                mr={1}
                color={"white"}
                zIndex={1}
                //@ts-ignore
                sx={{"-webkit-text-stroke": "1px black"}}
              >
                PUPPER PIXEL PICKER
              </Typography>
              {/*<Typography variant={TVariant.Title28} ml={2}>🐕</Typography>*/}
              <Typography
                position={"absolute"}
                left={-1}
                top={1}
                color={"black"}
                zIndex={-1}
                variant={TVariant.PresStart28}>
                PUPPER PIXEL PICKER
              </Typography>
            </Box>
          </Box>
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
          <ThemeChangeButton/>

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

const ThemeChangeButton = () => {
  const {colorMode, toggleColorMode} = useColorMode();
  return (
    <Box ml={3}>
      <Icon
        icon={colorMode === "light" ? "moon" : "sun"}
        color={colorMode === "light" ? "black" : "white"}
        cursor={"pointer"}
        onClick={toggleColorMode}
      />
    </Box>
  );
};

export default AppLayout;
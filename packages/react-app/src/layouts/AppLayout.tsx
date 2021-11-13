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

interface AppLayoutProps {
  children?: any;
}

const AppLayout = observer(function AppLayout({ children }: AppLayoutProps) {
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
      console.log("debug:: adding handlers")
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("debug:: handling accounts changed")
        showDebugToast("accounts changed")
        AppStore.web3.address = accounts[0]
      }

      const handleChainChanged = (_hexChainId: string) => {
        showDebugToast("chain changed, hard reloading")
        window.location.reload()
      }

      const handleDisconnect = (error: {code: number, message: string}) => {
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
    <Flex w={"100vw"} h={"100vh"} p={5} direction={"column"}>
      <Flex mb={3} justifyContent={"space-between"} alignItems={"center"}>
        <Typography variant={TVariant.Title28}>Pupper Pixel Portal 🐕</Typography>
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
          <ThemeChangeButton />

          {AppStore.web3.web3Provider && <Button size={"md"} ml={5} onClick={() => {
            AppStore.web3.disconnect()
          }}>
            Disconnect
          </Button>}

          {!AppStore.web3.web3Provider && <Button size={"md"} ml={5} onClick={() => {
            AppStore.web3.connect()
          }}>
            Connect Wallet
          </Button>}
          <VStack ml={3}>
            {AppStore.web3.address && <Typography variant={TVariant.Detail14}>{AppStore.web3.addressForDisplay}</Typography>}
            {AppStore.web3.web3Provider && <HStack>
              <VStack mr={1}>
                <Typography variant={TVariant.Body14}>$DOG</Typography>
                <Typography variant={TVariant.Detail14}>{AppStore.web3.dogBalance}</Typography>
                <Box>
                  <Button onClick={async () => {
                    const tx = await AppStore.web3.getDogToAccount()
                    await tx.wait()
                    AppStore.web3.refreshDogBalance()
                  }}>+</Button>
                  <Button onClick={async () => AppStore.web3.refreshDogBalance()}>refresh</Button>
                </Box>
              </VStack>
              <VStack ml={1}>
                <Typography variant={TVariant.Body14}>$PX</Typography>
                <Typography variant={TVariant.Detail14}>{AppStore.web3.pupperBalance}</Typography>
                <Box>
                  <Button onClick={async () => AppStore.web3.refreshPupperBalance()}>refresh</Button>
                </Box>
              </VStack>
            </HStack>}
          </VStack>
        </Flex>
      </Flex>
      {children}
    </Flex>
  );
});

const ThemeChangeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();
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
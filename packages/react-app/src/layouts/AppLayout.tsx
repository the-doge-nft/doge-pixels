import React, {useCallback, useEffect, useState} from "react";
import {Box, Flex, HStack, useColorMode} from "@chakra-ui/react";
import Typography, {TVariant} from "../DSL/Typography/Typography";
import Button, {ButtonVariant} from "../DSL/Button/Button";
import {useHistory, useLocation} from "react-router-dom";
import routes from "../App.routes";
import {ethers} from "ethers";
import {web3Modal} from "../services/web3Modal";
import {useUserProviderAndSigner} from "eth-hooks";
import Icon from "../DSL/Icon/Icon";
import {NETWORKS} from "../constants";

interface AppLayoutProps {
  children?: any;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const history = useHistory();


  //@ts-ignore
  const [injectedProvider, setInjectedProvider] = useState<any>()

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", (chainId: number) => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code: number, reason: number) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);


  const [address, setAddress] = useState<string | undefined>();

  const targetNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)
  const localProviderUrl = targetNetwork.rpcUrl;
  const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
  const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);

  // // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  // const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider);
  // const userSigner = userProviderAndSigner?.signer;
  //
  // useEffect(() => {
  //   async function getAddress() {
  //     if (userSigner) {
  //       const newAddress = await userSigner.getAddress();
  //       setAddress(newAddress);
  //     }
  //   }
  //   getAddress();
  // }, []);


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

          {web3Modal.cachedProvider && <Button size={"md"} ml={5} onClick={() => {
            console.log("debug:: logout")
            logoutOfWeb3Modal()
          }}>
            Disconnect
          </Button>}

          {!web3Modal.cachedProvider && <Button size={"md"} ml={5} onClick={() => {
            console.log("debug:: login")
            loadWeb3Modal()
          }}>
            Connect Wallet
          </Button>}
          {/*{address && <Typography variant={TVariant.Detail14}>{address}</Typography>}*/}
        </Flex>
      </Flex>
      {children}
    </Flex>
  );
};

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
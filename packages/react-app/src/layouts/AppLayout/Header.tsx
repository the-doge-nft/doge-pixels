import { Box, Flex, useBreakpointValue, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { GiHamburgerMenu } from "react-icons/gi";
import { useHistory, useLocation } from "react-router-dom";
import { useNetwork } from "wagmi";
import { NamedRoutes, route } from "../../App.routes";
import Button, { ConnectWalletButton } from "../../DSL/Button/Button";
import ColorModeToggle from "../../DSL/ColorModeToggle/ColorModeToggle";
import { darkModeGradient, lightOrDarkMode } from "../../DSL/Theme";
import DPPLogo from "../../images/logo.png";
import { targetChain } from "../../services/wagmi";
import AppStore from "../../store/App.store";
import NavLinks from "./NavLinks";

const Header = observer(() => {
  const history = useHistory();
  const location = useLocation();
  const onLogoClick = useBreakpointValue({
    base: () => AppStore.rwd.toggleMobileNav(),
    xl: () => history.push(route(NamedRoutes.VIEWER)),
  });
  const { chain } = useNetwork();
  const { colorMode } = useColorMode();
  const showHamburger = useBreakpointValue({ base: true, xl: false }, { fallback: "xl" });
  return (
    <Box>
      <Flex mb={{ base: 0, md: 6 }}>
        <Flex alignItems={"center"} w={"full"} gap={6}>
          <Box
            top={{ base: 8, md: 0 }}
            left={{ base: 5, md: 0 }}
            bg={lightOrDarkMode(colorMode, "yellow.50", darkModeGradient)}
            zIndex={10}
            position={{ base: "absolute", md: "relative" }}
            _hover={{
              cursor: "pointer",
            }}
            _active={{
              transform: "translate(4px, 4px)",
            }}
            onClick={onLogoClick}
            userSelect={"none"}
            borderWidth={1}
            borderColor={lightOrDarkMode(colorMode, "black", "white")}
            rounded={"full"}
          >
            <img src={DPPLogo} width={50} alt={"nav-dog"} />

            {showHamburger && (
              <>
                <Box
                  position={"absolute"}
                  top={0}
                  left={0}
                  w={"full"}
                  h={"full"}
                  bg={lightOrDarkMode(colorMode, "yellow.50", "purple.700")}
                  rounded={"full"}
                  opacity={0.85}
                />
                <Flex
                  justifyContent={"center"}
                  alignItems={"center"}
                  position={"absolute"}
                  left={0}
                  top={0}
                  w={"full"}
                  h={"full"}
                >
                  <GiHamburgerMenu color={lightOrDarkMode(colorMode, "black", "white")} size={24} />
                </Flex>
              </>
            )}
          </Box>
          <Flex gap={6} display={{ base: "none", xl: "flex" }}>
            <NavLinks
              onClick={() => {
                if (AppStore.rwd.isMobileNavOpen) {
                  AppStore.rwd.toggleMobileNav();
                }
              }}
            />
          </Flex>
        </Flex>
        <Flex>
          <Box display={{ base: "none", md: "flex" }} alignItems={"center"} justifyContent={"flex-end"} w={"full"}>
            <Flex mr={8} alignItems={"center"}>
              {AppStore.web3.isConnected && chain?.id === targetChain.id && (
                <Flex alignItems={"center"}>
                  <Button
                    size="sm"
                    mr={8}
                    onClick={() => {
                      if (location.pathname !== "/" && !location.pathname.includes("/px")) {
                        history.push("/");
                      }
                      AppStore.modals.isMintModalOpen = true;
                    }}
                  >
                    Mint
                  </Button>
                  {AppStore.web3.puppersOwned.length > 0 && (
                    <Button
                      size="sm"
                      mr={8}
                      onClick={() => {
                        if (location.pathname !== "/" && !location.pathname.includes("/px")) {
                          history.push("/");
                        }
                        AppStore.modals.isBurnModalOpen = true;
                      }}
                    >
                      Burn
                    </Button>
                  )}
                </Flex>
              )}
              <Box>
                <ColorModeToggle />
              </Box>
            </Flex>
            <ConnectWalletButton />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
});

export default Header;

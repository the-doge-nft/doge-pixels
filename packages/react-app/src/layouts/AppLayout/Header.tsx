import ColorModeToggle from "../../DSL/ColorModeToggle/ColorModeToggle";
import AppStore from "../../store/App.store";
import Button from "../../DSL/Button/Button";
import UserDropdown from "../UserDropdown";
import { observer } from "mobx-react-lite";
import { Box, Flex, HStack, useBreakpointValue, useColorMode } from "@chakra-ui/react";
import { NamedRoutes, route } from "../../App.routes";
import BigText from "../../DSL/BigText/BigText";
import { useHistory, useLocation } from "react-router-dom";
import NavLinks from "./NavLinks";
import DPPLogo from "../../images/logo.png"
import { darkModeGradient, darkModeSecondary, lightModePrimary, lightOrDarkMode } from "../../DSL/Theme";
import { GiHamburgerMenu } from "react-icons/gi";

const Header = observer(() => {
  const history = useHistory();
  const location = useLocation();
  const onLogoClick = useBreakpointValue({
    base: () => AppStore.rwd.toggleMobileNav(), 
    xl: () => history.push(route(NamedRoutes.VIEWER))
  });
  const { colorMode } = useColorMode();
  return (
    <Box>
      <Flex mb={{base: 0, md: 6}}>
        <Flex alignItems={"center"} w={"full"} gap={6}>
          <Box
            top={{base: 8, md: 0}}
            left={{base: 5, md: 0}}
            bg={lightOrDarkMode(colorMode, "yellow.50", darkModeGradient)}
            zIndex={10}
            position={{base: "absolute", md: "relative"}}
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
            <img src={DPPLogo} width={50}/>
          </Box>
          <Flex gap={4} display={{base: "none", xl: "flex"}}>
            <NavLinks />
          </Flex>
        </Flex>
        <Flex>
          <Box display={{ base: "none", md: "flex" }} alignItems={"center"} justifyContent={"flex-end"} w={"full"}>
            <Flex mr={8} alignItems={"center"}>
              {AppStore.web3.isConnected && <Flex alignItems={"center"}>
                <Button size="sm" mr={8} onClick={() => {
                  if (location.pathname !== "/" && !location.pathname.includes("/px")) {
                    history.push("/");
                  }
                  AppStore.modals.isMintModalOpen = true
                }}>Mint</Button>
                {AppStore.web3.puppersOwned.length > 0 && <Button size="sm" mr={8} onClick={() => {
                  if (location.pathname !== "/" && !location.pathname.includes("/px")) {
                    history.push("/");
                  }
                  AppStore.modals.isBurnModalOpen = true
                }}>Burn</Button>}
              </Flex>}
              <Box>
                <ColorModeToggle />
              </Box>
            </Flex>
            {!AppStore.web3.web3Provider && (
              <Button
                whiteSpace={{ base: "normal", lg: "nowrap" }}
                onClick={() => {
                  AppStore.web3.connect();
                }}
              >
                Connect
              </Button>
            )}
            {AppStore.web3.address && AppStore.web3.web3Provider && <UserDropdown />}
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
});

const Logo = () => {

}

export default Header;

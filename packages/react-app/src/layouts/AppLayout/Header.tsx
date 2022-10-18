import ColorModeToggle from "../../DSL/ColorModeToggle/ColorModeToggle";
import AppStore from "../../store/App.store";
import Button from "../../DSL/Button/Button";
import UserDropdown from "../UserDropdown";
import { observer } from "mobx-react-lite";
import { Box, Flex, HStack, useColorMode } from "@chakra-ui/react";
import { NamedRoutes, route } from "../../App.routes";
import BigText from "../../DSL/BigText/BigText";
import { useHistory, useLocation } from "react-router-dom";
import NavLinks from "./NavLinks";
import DPPLogo from "../../images/logo.png"
import { lightOrDarkMode } from "../../DSL/Theme";

const Header = observer(() => {
  const history = useHistory();
  const location = useLocation();
  const { colorMode } = useColorMode();
  return (
    <Box mb={6} display={{base: "none", md: "flex"}}>
      <Flex alignItems={"center"} w={"full"} gap={6}>
        <Box
          _hover={{
            cursor: "pointer",
          }}
          _active={{
            transform: "translate(4px, 4px)",
          }}
          onClick={() => {
            history.push(route(NamedRoutes.VIEWER));
          }}
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
    </Box>
  );
});

export default Header;

import ColorModeToggle from "../../DSL/ColorModeToggle/ColorModeToggle";
import AppStore from "../../store/App.store";
import Button from "../../DSL/Button/Button";
import UserDropdown from "../UserDropdown";
import { observer } from "mobx-react-lite";
import {Box, Flex, HStack} from "@chakra-ui/react";
import { NamedRoutes, route } from "../../App.routes";
import BigText from "../../DSL/BigText/BigText";
import { useHistory } from "react-router-dom";
import { useMemo } from "react";
import MintBurnButtons from "../../pages/Viewer/MintBurnButtons";

const Header = observer(() => {
  return (
    <Box mb={6} display={"flex"}>
      <Flex alignItems={"center"} w={"full"}>
        <Title />
      </Flex>
      <Flex>
        <Box mr={6} display={{ base: "none", xl: "block" }}>
          <Flex w={"full"} h={"full"} alignItems={"center"} justifyContent={"center"}>
            <HStack spacing={12}>{/*<NavLinks />*/}</HStack>
          </Flex>
        </Box>
        <Box display={{ base: "none", md: "flex" }} alignItems={"center"} justifyContent={"flex-end"} w={"full"}>
          <Flex mr={8} alignItems={"center"}>
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

const Title = () => {
  const history = useHistory();
  const text = useMemo(() => {
    if (AppStore.rwd.isMobile) {
      return "PIXEL PORTAL";
    }
    return "DOGE PIXEL PORTAL";
  }, [AppStore.rwd.isMobile]);
  return (
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
    >
      <BigText size={AppStore.rwd.isMobile ? "xs" : "sm"}>{text}</BigText>
    </Box>
  );
};

export default Header;

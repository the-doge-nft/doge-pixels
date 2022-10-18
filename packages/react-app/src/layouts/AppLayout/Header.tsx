import ColorModeToggle from "../../DSL/ColorModeToggle/ColorModeToggle";
import AppStore from "../../store/App.store";
import Button from "../../DSL/Button/Button";
import UserDropdown from "../UserDropdown";
import { observer } from "mobx-react-lite";
import { Box, Flex, HStack } from "@chakra-ui/react";
import { NamedRoutes, route } from "../../App.routes";
import BigText from "../../DSL/BigText/BigText";
import { useHistory } from "react-router-dom";
import NavLinks from "./NavLinks";
import DPPLogo from "../../images/logo.png"

const Header = observer(() => {
  const history = useHistory();
  return (
    <Box mb={6} display={"flex"}>
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
        >
          <img src={DPPLogo} width={50}/>
        </Box>
        <NavLinks />
      </Flex>
      <Flex>
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

export default Header;

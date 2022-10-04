import ColorModeToggle from "../../DSL/ColorModeToggle/ColorModeToggle";
import AppStore from "../../store/App.store";
import Button from "../../DSL/Button/Button";
import UserMenu from "../UserMenu";
import { observer } from "mobx-react-lite";
import { Box, Flex, Grid, GridItem, HStack, VStack } from "@chakra-ui/react";
import { NamedRoutes, route } from "../../App.routes";
import BigText from "../../DSL/BigText/BigText";
import { useHistory } from "react-router-dom";
import NavLinks from "./NavLinks";

const Header = observer(() => {
  return <Box mb={10} display={{ base: "none", md: "flex" }}>
    <Box w={"full"}>
      <Flex alignItems={"center"} mb={2}>
        <Title />
      </Flex>
    </Box>
    <Flex>
      <Box mr={6} display={{base: "none", xl: "block"}}>
        <Flex w={"full"} h={"full"} alignItems={"center"} justifyContent={"center"}>
          <HStack spacing={12}>
            {/*<NavLinks />*/}
          </HStack>
        </Flex>
      </Box>
      <Box display={{ base: "none", md: "flex" }} alignItems={"center"} justifyContent={"flex-end"} w={"full"}>
        <Flex mr={8}>
          <ColorModeToggle />
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
        {AppStore.web3.address && AppStore.web3.web3Provider && <UserMenu />}
      </Box>
    </Flex>
  </Box>
})

const Title = () => {
  const history = useHistory();
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
      w={"full"}
      userSelect={"none"}
    >
      <BigText size={"sm"}>DOGE PIXEL PORTAL</BigText>
    </Box>
  );
};

export default Header

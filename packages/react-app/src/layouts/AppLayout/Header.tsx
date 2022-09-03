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
  return <Grid
    templateColumns={{ base: "1fr", md: "1fr 1fr 1fr", lg: "1fr 1fr 1fr", xl: "1fr 0.5fr 0.5fr" }}
    mb={10}
    templateRows={"1fr"}
    display={{ base: "none", md: "grid" }}
  >
    <GridItem w={"full"}>
      <Flex alignItems={"center"} mb={2}>
        <Title />
      </Flex>
    </GridItem>
    <GridItem mx={4}>
      <Flex w={"full"} h={"full"} alignItems={"center"} justifyContent={"center"}>
        <HStack spacing={12}>
          <NavLinks />
        </HStack>
      </Flex>
    </GridItem>
    <GridItem display={{ base: "none", md: "flex" }} alignItems={"center"} justifyContent={"flex-end"} w={"full"}>
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
          Connect Wallet
        </Button>
      )}
      {AppStore.web3.address && AppStore.web3.web3Provider && <UserMenu />}
    </GridItem>
  </Grid>
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

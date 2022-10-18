import React from "react";
import { Box, Flex, HStack, useColorMode, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import AppStore from "../../store/App.store";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import NavLinks from "./NavLinks";
import Header from "./Header";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";
import Icon from "../../DSL/Icon/Icon";
import Modal from "../../DSL/Modal/Modal";
import Footer from "../../common/Footer/Footer";

interface AppLayoutProps {
  children?: any;
}

const AppLayout = observer(function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
    <Flex flexDir={"column"} id={"react-modal-main"} minH={"100vh"}>
      <Flex justifyContent={"center"} flexGrow={1}>
        <Flex flexGrow={1} w={"full"} maxW={"8xl"} pt={6} pb={8} pl={4} pr={7} flexDirection={"column"}>
          <Header />
          <Flex grow={1}>{children}</Flex>
        </Flex>
      </Flex>
    </Flex>
    <Flex justifyContent={"center"}>
      <Box display={{base: "none", md: "block"}} w={"full"} maxW={"8xl"} pl={4} pr={7} mb={6}>
        <Footer/>
      </Box>
    </Flex>
    </>
  );
});

const MobileNav = observer(() => {
  const { colorMode } = useColorMode();
  return (
    <Flex
      flexDirection={"column"}
      bottom={0}
      zIndex={3}
      height={"100px"}
      borderTopStyle={"solid"}
      borderTopWidth={"1px"}
      justifyContent={"center"}
      alignItems={"space-around"}
      bg={colorMode === "light" ? "yellow.50" : "purple.700"}
      borderTopColor={colorMode === "light" ? "black" : "white"}
    >
      <Flex justifyContent={"space-around"}>
        <NavLinks isMobile />
      </Flex>
    </Flex>
  );
});

export default AppLayout;

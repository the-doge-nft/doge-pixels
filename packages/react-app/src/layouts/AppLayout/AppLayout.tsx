import React from "react";
import {Box, Flex, HStack, useColorMode} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import AppStore from "../../store/App.store";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { Type } from "../../DSL/Fonts/Fonts";
import NavLinks from "./NavLinks";
import Header from "./Header";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";
import Icon from "../../DSL/Icon/Icon";
import {Link} from "react-router-dom";


interface AppLayoutProps {
  children?: any;
}

const AppLayout = observer(function AppLayout({ children }: AppLayoutProps) {
  return (
    <Flex justifyContent={"center"} flexGrow={1}>
      <Flex flexGrow={1} w={"full"} maxW={"8xl"} p={{ base: 0, md: 8 }} pb={{ base: 0, md: 3 }} flexDirection={"column"}>
        <Header />
        <Flex grow={1}>
          {children}
        </Flex>
        {AppStore.rwd.isMobile && <MobileNav />}
        {!AppStore.rwd.isMobile && <Footer />}
      </Flex>
    </Flex>
  );
});

const Footer = observer(() => {
  return (
      <HStack mt={5} justifyContent={'flex-end'} alignItems={'center'} spacing={2}>
        <a target={"_blank"} href={"https://discord.com/invite/thedogenft"} style={{ display: 'flex', alignItems: 'center' }}>
          <Icon icon={'discord'} boxSize={5}/>
        </a>
        <a target={"_blank"} href={"https://twitter.com/ownthedoge"} style={{ display: 'flex', alignItems: 'center' }}>
          <Icon icon={'twitter'} boxSize={4}/>
        </a>
        {AppStore.web3.usdPerPixel && <Typography variant={TVariant.ComicSans14}>
          ${formatWithThousandsSeparators(AppStore.web3.usdPerPixel, 2)} / pixel
        </Typography>}
      </HStack>
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

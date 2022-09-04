import React, { useState } from "react";
import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { slide as Menu } from "react-burger-menu";
import AppStore from "../../store/App.store";
import Link from "../../DSL/Link/Link";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { Type } from "../../DSL/Fonts/Fonts";
import NavLinks from "./NavLinks";
import Header from "./Header";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";

interface AppLayoutProps {
  children?: any;
}

const AppLayout = observer(function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Flex flexGrow={1} w={"100vw"} p={{ base: 0, md: 8 }} pb={{ base: 0, md: 3 }} flexDirection={"column"}>
        <Header />
        {AppStore.rwd.isMobile && <MobileNav />}
        <Flex grow={1}>
          {children}
        </Flex>
        {!AppStore.rwd.isMobile && <Footer />}
      </Flex>
    </>
  );
});

const Footer = observer(() => {
  const contributers: { name: string; socialLink: string }[] = [
    { name: "coldplunge", socialLink: "https://twitter.com/xcoldplunge" },
    { name: "gainormather", socialLink: "https://twitter.com/gainormather" },
    { name: "partyka1", socialLink: "https://github.com/partyka1" },
    { name: "nemochips", socialLink: "https://twitter.com/nemo__chips" },
  ];
  return (
    <Box w={"full"} mt={5}>
      <Flex justifyContent={"space-between"}>
        <Box>
          <Typography variant={TVariant.ComicSans10}>
            Built by
            {contributers.map((person, index, arr) => (
              <Link
                size={"sm"}
                key={`${person.name}`}
                fontWeight={"bold"}
                variant={Type.ComicSans}
                mx={1}
                href={person.socialLink}
                isExternal
              >
                {person.name}
                {index === arr.length - 1 ? "" : ","}
              </Link>
            ))}
            with support from
            <Link
              size={"sm"}
              fontWeight={"bold"}
              variant={Type.ComicSans}
              mx={1}
              href={"https://twitter.com/ownthedoge"}
              isExternal
            >
              The Doge NFT
            </Link>
          </Typography>
        </Box>
        <Box>
          {AppStore.web3.usdPerPixel && <Typography variant={TVariant.ComicSans12}>
            ${formatWithThousandsSeparators(AppStore.web3.usdPerPixel)} / pixel
          </Typography>}
        </Box>
      </Flex>
    </Box>
  );
});

const MobileNav = observer(() => {
  const { colorMode } = useColorMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleHamburger = (flag: boolean) => {
      setIsMenuOpen(flag)
  }
  return (
     <Flex
        bottom={0}
        zIndex={3}
        height={"50px"}
        justifyContent={"end"}
        paddingRight="10px"
        alignItems={"center"}
        width={"100%"}
        bg={colorMode === "light" ? "yellow.50" : "purple.700"}
        borderTopColor={colorMode === "light" ? "black" : "white"}
    >
        <Flex justifyContent={"space-around"} position={"relative"}>
            {/* <Links isMobile/> */}
            <Menu right styles={styles} isOpen={isMenuOpen} onOpen={() => toggleHamburger(true) } onClose={() => toggleHamburger(false)}>
                {/* <a href="/" className="menu-item">Home</a> */}
                <NavLinks isMobile/>
            </Menu>
        </Flex>
    </Flex>
  );
});


var styles = {
    bmBurgerButton: {
      width: '50px',
      height: '30px',
      right: '36px',
      top: '36px'
    },
    bmBurgerBars: {
      background: '#373a47'
    },
    bmBurgerBarsHover: {
      background: '#a90000'
    },
    bmCrossButton: {
      height: '24px',
      width: '24px'
    },
    bmCross: {
      background: '#bdc3c7'
    },
    bmMenuWrap: {
      position: 'fixed',
      height: '100%',
      width: '200px',
      top: '0'
    },
    bmMenu: {
      background: '#f1d27a',
      padding: '2.5em 1.5em 0',
      fontSize: '1.15em',
      height:  '100%'
    },
    bmItem: {
        padding: '5px'
    },
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.3)'
    }
  }

export default AppLayout;

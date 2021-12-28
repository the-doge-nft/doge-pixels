import React from "react";
import {Box, Flex, Grid, GridItem, HStack, useColorMode, VStack} from "@chakra-ui/react";
import Button from "../DSL/Button/Button";
import {matchPath, useHistory, useLocation} from "react-router-dom";
import routes, {NamedRoutes, route} from "../App.routes";
import {observer} from "mobx-react-lite";
import AppStore from "../store/App.store";
import ColorModeToggle from "../DSL/ColorModeToggle/ColorModeToggle";
import Link from "../DSL/Link/Link";
import BigText from "../DSL/BigText/BigText";
import UserMenu from "./UserMenu";
import Typography, {TVariant} from "../DSL/Typography/Typography";
import { Type } from "../DSL/Fonts/Fonts";

interface AppLayoutProps {
  children?: any;
}

const AppLayout = observer(function AppLayout({children}: AppLayoutProps) {
  return (
    <>
    <Flex
      w={"100vw"}
      h={"100vh"}
      p={{base:0, md: 8}}
      pb={{base: 0, md: 3}}
      flexDirection={"column"}
    >
      <Grid
        templateColumns={{base: "1fr", md: "1fr 1fr 1fr", lg: "1fr 1fr 1fr", xl: "1fr 0.5fr 0.5fr"}}
        mb={10}
        templateRows={"1fr"}
        display={{base: "none", md: "grid"}}
      >
        <GridItem w={"full"}>
          <Flex alignItems={"center"} mb={2}>
            <Title/>
          </Flex>
        </GridItem>
        <GridItem mx={4}>
          <Flex w={"full"} h={"full"} alignItems={"center"} justifyContent={"center"}>
            <Nav/>
          </Flex>
        </GridItem>
        <GridItem
          display={{base: "none", md: "flex"}}
          alignItems={"center"}
          justifyContent={"flex-end"}
          w={"full"}
        >
          <Flex mr={8}>
            <ColorModeToggle/>
          </Flex>
          {!AppStore.web3.web3Provider && <Button whiteSpace={{base: "normal", lg: "nowrap"}} onClick={() => {
            AppStore.web3.connect()
          }}>
              Connect Wallet
          </Button>}
          <VStack>
          {AppStore.web3.address && AppStore.web3.web3Provider && <UserMenu/>}
          </VStack>
        </GridItem>
      </Grid>
      {children}
      {AppStore.rwd.isMobile && <MobileNav/>}
      {!AppStore.rwd.isMobile && <Footer />}
    </Flex>
    </>
  );
});

const Footer = () => {
  const contributers: {name: string, socialLink: string}[] = [
    {name: "coldplunge", socialLink: "https://twitter.com/xcoldplunge"},
    {name: "gainormather", socialLink: "https://twitter.com/gainormather"},
    {name: "ayyyayayyy", socialLink: "https://twitter.com/ayyyayayyy"},
    //@TODO nemo chips twitter
    {name: "nemochips", socialLink: "https://twitter.com/nemo__chips"}
  ]
  return <Box w={"full"} mt={5}>
    <Box>
      <Typography variant={TVariant.ComicSans12}>
        Built by
        {contributers.map((person, index, arr) => <Link
          key={`${person.name}`}
          fontWeight={"bold"}
          variant={Type.ComicSans}
          mx={1}
          href={person.socialLink}
          isExternal>
          {person.name}
          {index === arr.length - 1 ? "" : ","}
        </Link>)}
        with support from
        <Link fontWeight={"bold"} variant={Type.ComicSans} mx={1} href={"https://twitter.com/ownthedoge"} isExternal>
          The Doge NFT
        </Link>
      </Typography>
    </Box>
  </Box>
}

const Nav = () => {
  const location = useLocation();
  return <HStack spacing={12}>
    {routes.map((appRoute) => {
      if (appRoute.showOnDesktop) {
        let path = route(appRoute.name, {
          address: appRoute.name === NamedRoutes.DOG_PARK && AppStore.web3.address ? AppStore.web3.address : undefined
        })
        const match = matchPath(location.pathname, {
          path: appRoute.path,
          exact: true,
          strict: false
        })
        console.log("debug:: test", match, location.pathname, appRoute.path)
        return (
          <Link
            isNav
            key={`desktop-nav-${appRoute.path}`}
            to={path}
            textDecoration={match ? "underline" : "none"}
          >
            {appRoute.desktopName}
          </Link>
        );
      } else return null
    })}
  </HStack>
}

const MobileNav = observer(() => {
  const location = useLocation()
  const { colorMode } = useColorMode()
  return <Flex
    bottom={0}
    zIndex={3}
    height={"100px"}
    borderTopStyle={"solid"}
    borderTopWidth={"1px"}
    alignItems={"center"}
    justifyContent={"space-around"}
    bg={colorMode === "light" ? "yellow.50" : "purple.700"}
    borderTopColor={colorMode === "light" ? "black" : "white"}
  >
    {routes.map((appRoute) => {
      if (appRoute.showOnMobile) {
        let path = route(appRoute.name, {
          address: appRoute.name === NamedRoutes.DOG_PARK && AppStore.web3.address ? AppStore.web3.address : undefined
        })
        const match = matchPath(location.pathname, {
          path: appRoute.path,
          exact: true,
          strict: false
        })
        return (
          <Link
            isNav
            to={path}
            size={"lg"}
            fontSize={"18px"}
            key={`mobile-nav-${appRoute.path}`}
            textDecoration={match ? "underline" : "none"}
          >
            {appRoute.mobileName}
          </Link>
        );
      } else return null
    })}
  </Flex>
})

const Title = () => {
  const history = useHistory()
  return <Box
      _hover={{
        cursor: "pointer"
      }}
      _active={{
        transform: "translate(4px, 4px)"
      }}
      onClick={() => {
        history.push(route(NamedRoutes.VIEWER));
      }}
      w={"full"}
      userSelect={"none"}
    >
      <BigText size={"sm"}>
        DOGE PIXEL PORTAL
      </BigText>
    </Box>
}


export default AppLayout;



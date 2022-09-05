import React, { useState } from "react";
import {Box, Flex, Grid, GridItem, HStack, useColorMode, VStack} from "@chakra-ui/react";
import Button from "../DSL/Button/Button";
import {matchPath, useHistory, useLocation} from "react-router-dom";
import routes, {AppRouteInterface, NamedRoutes, route, SELECTED_PIXEL_PARAM} from "../App.routes";
import {observer} from "mobx-react-lite";
import { slide as Menu } from "react-burger-menu";
import AppStore from "../store/App.store";
import ColorModeToggle from "../DSL/ColorModeToggle/ColorModeToggle";
import Link from "../DSL/Link/Link";
import BigText from "../DSL/BigText/BigText";
import UserMenu from "./UserMenu";
import Typography, {TVariant} from "../DSL/Typography/Typography";
import {Type} from "../DSL/Fonts/Fonts";

interface AppLayoutProps {
    children?: any;
}

const AppLayout = observer(function AppLayout({children}: AppLayoutProps) {
    return (
        <>
            <Flex
                flexGrow={1}
                w={"100vw"}
                p={{base: 0, md: 8}}
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
                            <HStack spacing={12}>
                                <Links/>
                            </HStack>
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
                        {!AppStore.web3.web3Provider &&
                        <Button whiteSpace={{base: "normal", lg: "nowrap"}} onClick={() => {
                            AppStore.web3.connect()
                        }}>
                          Connect Wallet
                        </Button>}
                        <VStack>
                            {AppStore.web3.address && AppStore.web3.web3Provider && <UserMenu/>}
                        </VStack>
                    </GridItem>
                </Grid>
                {AppStore.rwd.isMobile && <MobileNav/>}
                {children}
                
                {!AppStore.rwd.isMobile && <Footer/>}
            </Flex>
        </>
    );
});

const Footer = observer(() => {
    const contributers: { name: string, socialLink: string }[] = [
        {name: "coldplunge", socialLink: "https://twitter.com/xcoldplunge"},
        {name: "gainormather", socialLink: "https://twitter.com/gainormather"},
        {name: "partyka1", socialLink: "https://github.com/partyka1"},
        {name: "nemochips", socialLink: "https://twitter.com/nemo__chips"}
    ]
    return <Box w={"full"} mt={5}>
        <Flex justifyContent={"space-between"}>
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
                    <Link fontWeight={"bold"} variant={Type.ComicSans} mx={1} href={"https://twitter.com/ownthedoge"}
                          isExternal>
                        The Doge NFT
                    </Link>
                </Typography>
            </Box>
        </Flex>
    </Box>
})

const MobileNav = observer(() => {
    const {colorMode} = useColorMode()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleHamburger = (flag: boolean) => {
        setIsMenuOpen(flag)
    }
    return <Flex
        // flexDirection={"column"}
        bottom={0}
        zIndex={3}
        height={"50px"}
        // borderTopStyle={"solid"}
        // borderTopWidth={"1px"}
        justifyContent={"end"}
        paddingRight="10px"
        // alignItems={"center"}
        alignItems={"center"}
        width={"100%"}
        // position={"absolute"}
        bg={colorMode === "light" ? "yellow.50" : "purple.700"}
        borderTopColor={colorMode === "light" ? "black" : "white"}
    >
        <Flex justifyContent={"space-around"} position={"relative"}>
            {/* <Links isMobile/> */}
            <Menu right styles={styles} isOpen={isMenuOpen} onOpen={() => toggleHamburger(true) } onClose={() => toggleHamburger(false)}>
                {/* <a href="/" className="menu-item">Home</a> */}
                <Links isMobile/>
            </Menu>
        </Flex>
    </Flex>
})

const Links = ({isMobile}: { isMobile?: boolean }) => {
    const location = useLocation();

    const getPath = (routeName: NamedRoutes) => {
        let path = route(routeName, {
            address: routeName === NamedRoutes.DOG_PARK && AppStore.web3.address ? AppStore.web3.address : undefined
        })
        return path
    }

    const getMatch = (routePath: string) => {
        let match = matchPath<any>(location.pathname, {
            path: routePath,
            exact: true,
            strict: false
        })

        /*
          Hack to match NamedRoutes.PIXELS route to the NamedRoutes.VIEWER link as they both render the same
          component but NamedRoutes.PIXELS is hidden from desktop & mobile views.
        */
        const isSelectedPixelMatch = matchPath<any>(location.pathname, {
            path: route(NamedRoutes.PIXELS),
            exact: true,
            strict: false
        })

        if (
            isSelectedPixelMatch
            && SELECTED_PIXEL_PARAM in isSelectedPixelMatch.params
            && routePath === route(NamedRoutes.VIEWER)
        ) {
            return true
        }
        return match
    }

    const sortBy = (a: AppRouteInterface, b: AppRouteInterface) => {
        const aOrder = a.order
        const bOrder = b.order
        if (aOrder > bOrder) {
            return 1
        } else if (aOrder < bOrder) {
            return -1
        }
        return 0
    }

    return <>
        {isMobile
            ? [...routes].sort(sortBy).filter(route => route.showOnMobile).map((appRoute) => <Link
                    isNav
                    to={getPath(appRoute.name)}
                    size={"lg"}
                    fontSize={"18px"}
                    marginBottom="5px"
                    display="block"
                    key={`mobile-nav-${appRoute.path}`}
                    textDecoration={getMatch(appRoute.path) ? "underline" : "none"}
                >
                    {appRoute.mobileName}
                </Link>
            )
            : [...routes].sort(sortBy).filter(route => route.showOnDesktop).map((appRoute) => <Link
                    isNav
                    key={`desktop-nav-${appRoute.path}`}
                    to={getPath(appRoute.name)}
                    textDecoration={getMatch(appRoute.path) ? "underline" : "none"}
                >
                    {appRoute.desktopName}
                </Link>
            )}
    </>
}

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
      width: '250px',
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



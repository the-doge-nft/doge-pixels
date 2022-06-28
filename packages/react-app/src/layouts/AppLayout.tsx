import React from "react";
import {Box, Flex, Grid, GridItem, HStack, useColorMode, VStack} from "@chakra-ui/react";
import Button from "../DSL/Button/Button";
import {matchPath, useHistory, useLocation} from "react-router-dom";
import routes, {AppRouteInterface, NamedRoutes, route, SELECTED_PIXEL_PARAM} from "../App.routes";
import {observer} from "mobx-react-lite";
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
                {children}
                {AppStore.rwd.isMobile && <MobileNav/>}
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
    return <Flex
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
            <Links isMobile/>
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

export default AppLayout;



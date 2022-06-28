import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {Box, ChakraProvider, ColorModeScript, Flex, useColorMode} from "@chakra-ui/react";
import theme, {darkModeGradient} from "./DSL/Theme";
import Fonts from "./DSL/Fonts/Fonts";
import * as Sentry from "@sentry/react";
import {Integrations} from "@sentry/tracing";
import {motion} from "framer-motion";
import Typography, {TVariant} from "./DSL/Typography/Typography";
import {isDevModeEnabled} from "./environment/helpers";

Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0
})

const DevBanner = () => {
    const {colorMode} = useColorMode();
    return <>
        <Box
            w={"100%"}
            bg={colorMode === "light" ? "black" : "purple.700"}
            whiteSpace={"nowrap"}
            overflowX={"hidden"}
        >
            <motion.div
                animate={{x: ["100%", "-100%"], display: "flex", alignItems: "center", padding: "3px 0px"}}
                transition={{x: {duration: 60, repeat: Infinity, ease: "linear", repeatType: "loop"}}}
            >
                {new Array(10).fill(undefined).map((item, index) => <Typography
                    key={`dev-banner-${index}`}
                    variant={TVariant.PresStart10}
                    color={"white"}
                    // eslint-disable-next-line
                    mx={5}>/////// ✨✨✨ rinkeby ✨✨✨ ///////</Typography>)}
            </motion.div>
        </Box>
    </>
}

const BuyHereBanner = () => {
    const {colorMode} = useColorMode()
    return <a href={"https://www.coingecko.com/en/coins/the-doge-nft#markets"} target={"_blank"}>
        <Box
            py={1}
            bg={colorMode === "light" ? "black" : darkModeGradient}
            color={"white"}
            _hover={{bg: colorMode === "light" ? "yellow.700" : "magenta.50", color: colorMode === "light" ? "black" : "white"}}
             whiteSpace={"nowrap"} overflowX={"hidden"}>
            <motion.div
                animate={{x: ["100%", "-100%"], display: "flex", alignItems: "center", padding: "3px 0px"}}
                transition={{x: {duration: 40, repeat: Infinity, ease: "linear", repeatType: "loop"}}}
            >
                {new Array(10).fill(undefined).map((item, index) => <Typography
                    key={`dev-banner-${index}`}
                    variant={TVariant.PresStart12}
                    display={"flex"}
                    alignItems={"center"}
                    color={"inherit"}
                    // eslint-disable-next-line
                    mx={5}>✨✨✨ Don't have $DOG? Click here to buy ✨✨✨</Typography>)}
            </motion.div>
        </Box>
    </a>
}

ReactDOM.render(
    <React.StrictMode>
        <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
        <ChakraProvider theme={theme} resetCSS>
            <Fonts/>
            <Flex h={"100vh"} flexDirection={"column"}>
                <BuyHereBanner/>
                {isDevModeEnabled() && <DevBanner/>}
                <App/>
            </Flex>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById("root"),
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

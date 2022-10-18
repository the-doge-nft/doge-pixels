import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Box, ChakraProvider, ColorModeScript, Flex, HStack } from "@chakra-ui/react";
import theme from "./DSL/Theme";
import Fonts from "./DSL/Fonts/Fonts";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { motion } from "framer-motion";
import Typography, { TVariant } from "./DSL/Typography/Typography";
import Marquee from "./DSL/Marquee/Marquee";
import { observer } from "mobx-react-lite";
import Icon from "./DSL/Icon/Icon";
import AppStore from "./store/App.store";
import { formatWithThousandsSeparators } from "./helpers/numberFormatter";
import Footer from "./common/Footer/Footer";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme} resetCSS>
      <Fonts />
      <Flex flexDir={"column"} id={"react-modal-main"} minH={"100vh"} mb={8}>
        <App />
      </Flex>
      <Flex justifyContent={"center"} px={{base: 4, md: 4, xl: 16}} mb={6}>
        <Footer/>
      </Flex>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

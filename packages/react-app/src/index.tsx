import { ChakraProvider, ColorModeScript, useColorMode } from "@chakra-ui/react";
import { darkTheme, lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import React from "react";
import { createRoot } from 'react-dom/client';
import { WagmiConfig } from "wagmi";
import App from "./App";
import Colors from "./DSL/Colors/Colors";
import Fonts, { Type } from "./DSL/Fonts/Fonts";
import theme from "./DSL/Theme";
import { ToastContainer } from "./DSL/Toast/Toast";
import wagmiClient, { chains } from "./services/wagmi";


Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

const customLightTheme = lightTheme({
  borderRadius: 'none',
  fontStack: 'system',
  accentColor: Colors.yellow[100],
  overlayBlur: 'small'
})
customLightTheme.fonts.body = Type.ComicSans
customLightTheme.colors.modalBackground = Colors.yellow[50]
customLightTheme.colors.modalBorder = "black"

const customDarkTheme = darkTheme({
  borderRadius: 'none',
  fontStack: 'system',
  accentColor: Colors.gray[300],
  overlayBlur: 'small'
})
customDarkTheme.fonts.body = Type.ComicSans
customDarkTheme.colors.modalBackground = Colors.purple[700]
customDarkTheme.colors.modalBorder = "white"

const Test = () => {
  const { colorMode } = useColorMode()
  return <RainbowKitProvider chains={chains} theme={colorMode === "light" ? customLightTheme : customDarkTheme}>
    <Fonts />
    <App />
    <ToastContainer/>
  </RainbowKitProvider>
}

const container = document.getElementById("root")
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <WagmiConfig client={wagmiClient}>
      <ChakraProvider theme={theme} resetCSS>
        <Test />
      </ChakraProvider>
    </WagmiConfig>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

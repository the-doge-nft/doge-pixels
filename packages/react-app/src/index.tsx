import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
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

const rainbowTheme = lightTheme({
  borderRadius: 'none',
  fontStack: 'system',
  accentColor: Colors.yellow[100],
})
rainbowTheme.fonts.body = Type.ComicSans
rainbowTheme.colors.modalBackground = Colors.yellow[50]
rainbowTheme.colors.modalBorder = "black"

const container = document.getElementById("root")
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={rainbowTheme}>
        <ChakraProvider theme={theme} resetCSS>
          <Fonts />
          <App />
          <ToastContainer/>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

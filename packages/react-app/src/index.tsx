import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./DSL/Theme";
import Fonts from "./DSL/Fonts/Fonts";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

console.log("debug:: dns", process.env.REACT_APP_SENTRY_DSN)

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0
})

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme} resetCSS>
      <Fonts />
      <div id={"react-modal-main"}>
        <App />
      </div>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

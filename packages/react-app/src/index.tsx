import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {ChakraProvider} from "@chakra-ui/react";
import theme from "./DSL/Theme";
import Fonts from "./DSL/Fonts/Fonts";

ReactDOM.render(
  <React.StrictMode>
      <ChakraProvider theme={theme} resetCSS>
          <Fonts />
          <App />
      </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

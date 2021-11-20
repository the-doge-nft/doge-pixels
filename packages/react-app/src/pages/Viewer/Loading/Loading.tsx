import {Box, useColorMode} from "@chakra-ui/react";
import React from "react";
import { lightOrDark } from "../../../DSL/Theme";
import "./Loading.css";


const Loading = () => {
  const {colorMode} = useColorMode()
  return <Box
    className={"loading"}
    color={lightOrDark(colorMode, "black", "white")}
    w={"100%"}
    h={"100%"}
    display={"flex"}
    justifyContent={"center"}
    alignItems={"center"}
  >
    loading
  </Box>
}

export default Loading;

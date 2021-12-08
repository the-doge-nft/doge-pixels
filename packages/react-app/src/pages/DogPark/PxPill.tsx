import React from "react";
import {Box, useColorMode} from "@chakra-ui/react";
import {lightOrDark} from "../../DSL/Theme";
import Typography, {TVariant} from "../../DSL/Typography/Typography";

const PxPill = ({count}: { count: number }) => {
  const {colorMode} = useColorMode()
  return <Box
    display={"inline-flex"}
    borderRadius={100}
    justifyContent={"center"}
    alignItems={"center"}
    borderWidth={"1px"}
    borderStyle={"solid"}
    borderColor={lightOrDark(colorMode, "black", "white")}
    minWidth={"80px"}
    px={"12px"}
    py={"4px"}
  >
    <Typography variant={TVariant.ComicSans18} mr={1}>{count}</Typography>
    <Typography variant={TVariant.ComicSans18} ml={1}>PX</Typography>
  </Box>
}

export default PxPill;

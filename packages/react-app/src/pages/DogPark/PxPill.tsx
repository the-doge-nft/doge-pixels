import React from "react";
import {Box, useColorMode} from "@chakra-ui/react";
import {lightOrDark} from "../../DSL/Theme";
import Typography, {TVariant} from "../../DSL/Typography/Typography";

const PxPill = ({count}: { count: number }) => {
  const {colorMode} = useColorMode()
  return <Box
    display={"inline-flex"}
    borderRadius={16}
    justifyContent={"space-between"}
    alignItems={"center"}
    borderWidth={"1px"}
    borderStyle={"solid"}
    borderColor={lightOrDark(colorMode, "black", "white")}
    minWidth={"100px"}
    px={"12px"}
    py={"6px"}
  >
    <Typography variant={TVariant.PresStart14}>{count}</Typography>
    <Typography variant={TVariant.PresStart14}>PX</Typography>
  </Box>
}

export default PxPill;

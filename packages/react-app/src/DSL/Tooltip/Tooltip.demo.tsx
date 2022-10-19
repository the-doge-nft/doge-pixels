import React from "react";
import Tooltip from "./Tooltip";
import { Box } from "@chakra-ui/react";
import Demo from "../Demo/Demo";
import { Type } from "../Fonts/Fonts";

const TooltipDemo = () => {
  return (
    <Demo title={"Tooltip"}>
      <Tooltip background={"yellow.100"} label={"test"} hasArrow fontFamily={Type.ComicSans}>
        <Box>test</Box>
      </Tooltip>
    </Demo>
  );
};

export default TooltipDemo;

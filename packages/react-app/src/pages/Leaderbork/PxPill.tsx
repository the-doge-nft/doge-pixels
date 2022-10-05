import React from "react";
import { Box, useColorMode } from "@chakra-ui/react";
import { lightOrDarkMode } from "../../DSL/Theme";
import Typography, { TVariant } from "../../DSL/Typography/Typography";

const PxPill = ({ count, bg }: { count: number; bg?: string }) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      display={"inline-flex"}
      borderRadius={100}
      justifyContent={"center"}
      alignItems={"center"}
      borderWidth={"1px"}
      borderStyle={"solid"}
      borderColor={lightOrDarkMode(colorMode, "black", "white")}
      bg={bg}
      minWidth={"80px"}
      py={"2px"}
    >
      <Typography variant={TVariant.ComicSans16} mr={1}>
        {count}
      </Typography>
      <Typography variant={TVariant.ComicSans16} ml={1}>
        PX
      </Typography>
    </Box>
  );
};

export default PxPill;

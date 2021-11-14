import {Box, Switch, useStyleConfig, Image, useColorMode} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, {useState} from "react";
import Icon from "../Icon/Icon";
import PixelDog from "./pixelDog.svg";
import PixelSun from "./sunPixel.svg";
import PixelMoon from "./moonPixel.svg";

interface ColorModeToggleProps {
}

const ColorModeToggle = (props: ColorModeToggleProps) => {
  const styles = useStyleConfig("ColorModeToggle");
  const { colorMode, toggleColorMode } = useColorMode()

  //@ts-ignore
  console.log("debug:: styles", styles.container)

  const isLight = colorMode === "light";
  const lightModeDogeStyle = {
    transform: "scaleX(-1)",
    right: "2px"
  }
  const darkModeDogeStyle = {
    left: "2px",
    top: "-2px"
  }

  const containerWidth = 130
  const containerXPadding = 10
  const handleSize = 40

  return <Box
    //@ts-ignore
    __css={styles.container}
    onClick={toggleColorMode}
  >
    <motion.div
      style={{
        position: "relative",
        background: "black",
        borderRadius: 100,
        width: `${handleSize}px`,
        height: `${handleSize}px`,
        zIndex: 1,
        overflow: "hidden"
      }}
      animate={{
        left: isLight ? "0" : `${containerWidth - (2*containerXPadding) - handleSize}px`
      }}
    >
      <Image
        src={PixelDog}
        maxWidth={"140%"}
        width={"140%"}
        height={"140%"}
        position={"absolute"}
        sx={isLight ? lightModeDogeStyle : darkModeDogeStyle}
      />
    </motion.div>
    <Box
      position={"absolute"}
      left={`${0 + containerXPadding}px`}
      ml={2}
    >
      <img src={PixelSun} width={"22px"} height={"22px"}/>
    </Box>
    <Box
      position={"absolute"}
      right={`${0 + containerXPadding}px`}
      mr={2}
    >
      <img src={PixelMoon} width={"22px"} height={"22px"}/>
    </Box>
  </Box>
}

export default ColorModeToggle;

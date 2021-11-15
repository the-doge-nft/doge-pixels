import {Box, Switch, useStyleConfig, Image, useColorMode, useMultiStyleConfig} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, {useState} from "react";
import Icon from "../Icon/Icon";
import PixelDog from "./pixelDog.svg";
import PixelSun from "./sunPixel.svg";
import PixelMoon from "./moonPixel.svg";

interface ColorModeToggleProps {
}

const ColorModeToggle = (props: ColorModeToggleProps) => {
  const styles = useMultiStyleConfig("ColorModeToggle", {})
  const { toggleColorMode } = useColorMode()

  return <Box
    __css={styles.container}
    onClick={toggleColorMode}
  >
    <motion.div
      //@ts-ignore
      style={styles.handle}
      //@ts-ignore
      animate={{
        left: styles.handle.left
      }}
    >
      <Image
        src={PixelDog}
        sx={styles.dogeImage}
      />
    </motion.div>
    <Box __css={styles.leftIcon}>
      <img src={PixelSun} width={"22px"} height={"22px"}/>
    </Box>
    <Box __css={styles.rightIcon}>
      <img src={PixelMoon} width={"22px"} height={"22px"}/>
    </Box>
  </Box>
}

export default ColorModeToggle;

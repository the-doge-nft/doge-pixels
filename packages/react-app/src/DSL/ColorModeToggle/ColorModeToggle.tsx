import {Box, Image, useColorMode, useMultiStyleConfig} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import PixelDog from "./pixelDog.svg";
import PixelSun from "./sunPixel.svg";
import PixelMoon from "./moonPixel.svg";
import {web3Modal, web3ModalDarkTheme, web3ModalLightTheme} from "../../services/web3Modal";

interface ColorModeToggleProps {
}

const ColorModeToggle = (props: ColorModeToggleProps) => {
  const styles = useMultiStyleConfig("ColorModeToggle", {})
  const { colorMode, toggleColorMode } = useColorMode()

  //@ts-ignore
  useEffect(async () => {
    if (colorMode === "light") {
      // alert("update to light theme")
      await web3Modal.updateTheme(web3ModalLightTheme);
    } else {
      // alert("update to dark theme")
      await web3Modal.updateTheme(web3ModalDarkTheme)
    }
  }, [colorMode])

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

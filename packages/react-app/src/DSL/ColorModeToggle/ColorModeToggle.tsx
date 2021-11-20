import {Box, Image, useColorMode, useMultiStyleConfig} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import LightDog from "./lightDog.png";
import DarkDog from "./darkDog.png"
import PixelSun from "./sunPixel.svg";
import PixelMoon from "./moonPixel.svg";
import {web3Modal, web3ModalDarkTheme, web3ModalLightTheme} from "../../services/web3Modal";

interface ColorModeToggleProps {
}

const ColorModeToggle = (props: ColorModeToggleProps) => {
  const styles = useMultiStyleConfig("ColorModeToggle", {})
  const { colorMode, toggleColorMode } = useColorMode()

  const [isDogeVisible, setIsDogeVisible] = useState(false)

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
    onMouseEnter={() => setIsDogeVisible(true)}
    onMouseLeave={() => setIsDogeVisible(false)}
  >
    <motion.div
      //@ts-ignore
      style={styles.handle}
      //@ts-ignore
      animate={{
        left: styles.handle.left
      }}
    >
      <AnimatePresence>
        {isDogeVisible && (
          <motion.div
            initial={{ top: "100%", position: 'relative' }}
            animate={{ top: 0, position: 'relative' }}
            exit={{ top: "100%", position: 'relative' }}
          >
            <Image
              src={colorMode === "light" ? DarkDog : LightDog}
              sx={styles.dogeImage}/>
          </motion.div>
        )}
      </AnimatePresence>
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

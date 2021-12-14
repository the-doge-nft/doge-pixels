import {Box, Image, useColorMode, useMultiStyleConfig} from "@chakra-ui/react";
import {AnimatePresence, AnimationControls, motion, MotionStyle} from "framer-motion";
import React, { useEffect, useState } from "react";
import LightDog from "../../images/lightDog.png";
import DarkDog from "../../images/darkDog.png"
import PixelSun from "../../images/sunPixel.svg";
import PixelMoon from "../../images/moonPixel.svg";
import LightFavicon from "../../images/favicons/favicon_light.png";
import DarkFavicon from "../../images/favicons/favicon_dark.png";
import {web3Modal, web3ModalDarkTheme, web3ModalLightTheme} from "../../services/web3Modal";

interface ColorModeToggleProps {
}

const ColorModeToggle = (props: ColorModeToggleProps) => {
  const styles = useMultiStyleConfig("ColorModeToggle", {})
  const { colorMode, toggleColorMode } = useColorMode()
  const [isDogeVisible, setIsDogeVisible] = useState(false)

  // @TODO: this doesn't work :(
  // useEffect(() => {
  //   if (colorMode === "light") {
  //     web3Modal.updateTheme(web3ModalLightTheme);
  //   } else {
  //     web3Modal.updateTheme(web3ModalDarkTheme)
  //   }
  // }, [colorMode])

  useEffect(() => {
    const favicon = document.querySelector<HTMLAnchorElement>('link[rel="icon"]')

    if (favicon) {
      if (colorMode === "dark") {
        favicon.href = DarkFavicon
      } else {
        favicon.href = LightFavicon
      }
    }
  }, [colorMode])

  return <Box position={"relative"} zIndex={2}>
    <Box
      __css={styles.container}
      onClick={toggleColorMode}
      onMouseEnter={() => setIsDogeVisible(true)}
      onMouseLeave={() => setIsDogeVisible(false)}
    >
      <motion.div
        style={styles.handle as MotionStyle}
        animate={{
          left: styles.handle.left as any
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
    <Box __css={styles.drop}/>
  </Box>
}

export default ColorModeToggle;

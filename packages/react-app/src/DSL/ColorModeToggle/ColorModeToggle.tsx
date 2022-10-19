import { Box, Image, useColorMode, useMultiStyleConfig } from "@chakra-ui/react";
import { AnimatePresence, motion, MotionStyle } from "framer-motion";
import React, { useEffect, useState } from "react";
import LightDog from "../../images/lightDog.png";
import DarkDog from "../../images/darkDog.png";
import LightFavicon from "../../images/favicons/favicon_light.png";
import DarkFavicon from "../../images/favicons/favicon_dark.png";
import Icon from "../Icon/Icon";
import { colorModeType, darkModeGradient } from "../Theme";

interface ColorModeToggleProps {}

const toggleFaviconColorMode = (colorMode: colorModeType) => {
  const favicon = document.querySelector<HTMLAnchorElement>('link[rel="icon"]');

  if (favicon) {
    if (colorMode === "dark") {
      favicon.href = DarkFavicon;
    } else {
      favicon.href = LightFavicon;
    }
  }
};

const ColorModeToggle = (props: ColorModeToggleProps) => {
  const styles = useMultiStyleConfig("ColorModeToggle", {});
  const { colorMode, toggleColorMode } = useColorMode();
  const [isDogeVisible, setIsDogeVisible] = useState(false);

  useEffect(() => {
    toggleFaviconColorMode(colorMode);
  }, [colorMode]);

  return (
    <Box display={"inline-block"} position={"relative"} zIndex={2}>
      <Box
        __css={styles.container}
        onClick={toggleColorMode}
        onMouseEnter={() => setIsDogeVisible(true)}
        onMouseLeave={() => setIsDogeVisible(false)}
      >
        <motion.div
          style={{
            ...(styles.handle as MotionStyle),
            background: colorMode === "dark" ? (isDogeVisible ? darkModeGradient : "#180E30") : "black",
          }}
          animate={{
            left: styles.handle.left as any,
          }}
        >
          <AnimatePresence>
            {isDogeVisible && (
              <motion.div
                initial={{ top: "100%", position: "relative" }}
                animate={{ top: 0, position: "relative" }}
                exit={{ top: "100%", position: "relative" }}
              >
                <Image src={colorMode === "light" ? DarkDog : LightDog} sx={styles.dogeImage} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <Box __css={styles.leftIcon}>
          <Icon icon={"sun"} boxSize={5} />
        </Box>
        <Box __css={styles.rightIcon}>
          <Icon icon={"moon"} boxSize={5} />
        </Box>
      </Box>
      <Box __css={styles.drop} />
    </Box>
  );
};

export default ColorModeToggle;

import React, { useEffect } from "react";
import { Box, Button, Flex, HStack, useColorMode, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import AppStore from "../../store/App.store";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import NavLinks from "./NavLinks";
import Header from "./Header";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";
import Icon from "../../DSL/Icon/Icon";
import Modal from "../../DSL/Modal/Modal";
import Footer from "../../common/Footer/Footer";
import { lightOrDarkMode } from "../../DSL/Theme";
import { AnimatePresence, motion } from "framer-motion";

interface AppLayoutProps {
  children?: any;
}

const AppLayout = observer(function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Flex flexDir={"column"} id={"react-modal-main"} minH={"100vh"}>
        <Flex justifyContent={"center"} flexGrow={1}>
          <Flex flexGrow={1} w={"full"} maxW={"8xl"} pt={6} pb={8} pl={4} pr={7} flexDirection={"column"}>
            <Header />
            <Flex grow={1}>{children}</Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex justifyContent={"center"}>
        <Box display={{base: "none", md: "block"}} w={"full"} maxW={"8xl"} pl={4} pr={7} mb={6}>
          <Footer/>
        </Box>
      </Flex>
      <MobileNav/>
    </>
  );
});

const MobileNav = observer(() => {
  const { colorMode } = useColorMode();
  useEffect(() => {
    const closeOnEsc = (e) => {
      if (e.key === 'Escape') {
        if (AppStore.rwd.isMobileNavOpen) {
          AppStore.rwd.toggleMobileNav()
        }
      }
    }
    document.addEventListener("keydown", closeOnEsc)
    return () => {
      document.removeEventListener("keydown", closeOnEsc)
    }
  }, [])
  return (
    <AnimatePresence exitBeforeEnter>
      {AppStore.rwd.isMobileNavOpen && <motion.div
        style={{
          display: "flex",
          position: "absolute",
          width: "100vw",
          height: "100vh",
          zIndex: 100,
          background: "transparent",
          justifyContent: "center",
          alignItems: "center",
          top: 0
        }}
        initial={{left: -window.innerWidth}}
        animate={{left: 0}}
        exit={{left: -window.innerWidth}}
        transition={{duration: 0.25}}
      >
      <Box opacity={0.9} position={"absolute"} w={"full"} h={"full"} bg={lightOrDarkMode(colorMode, "yellow.50", "purple.700")}/>
      <Box zIndex={101}>
        <Flex flexDir={"column"} justifyContent={"center"} alignItems={"center"} gap={5}>
          <NavLinks onClick={() => {
              if (AppStore.rwd.isMobileNavOpen) {
                AppStore.rwd.toggleMobileNav()
              }
            }} isMobile={AppStore.rwd.isMobile} size={"lg"}/>
        </Flex>
        <Box position={"absolute"} top={5} right={5}>
          <Icon cursor={"pointer"} boxSize={35} icon={"close"} onClick={() => AppStore.rwd.toggleMobileNav()}/>
        </Box>
      </Box>
    </motion.div>}
    </AnimatePresence>
  );
});

export default AppLayout;

import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import Footer from "../../common/Footer/Footer";
import Icon from "../../DSL/Icon/Icon";
import { lightOrDarkMode } from "../../DSL/Theme";
import AppStore from "../../store/App.store";
import Header from "./Header";
import NavLinks from "./NavLinks";

interface AppLayoutProps {
  children?: any;
}

const AppLayout = observer(function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Flex flexDir={"column"} id={"react-modal-main"} minH={"100vh"}>
        <Flex justifyContent={"center"} flexGrow={1} zIndex={1}>
          <Flex flexGrow={1} w={"full"} maxW={"8xl"} py={6} px={4} flexDirection={"column"}>
            <Header />
            <Flex grow={1}>{children}</Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex position={"relative"} zIndex={0} justifyContent={"center"}>
        <Box display={{ base: "none", md: "block" }} w={"full"} maxW={"8xl"} px={4} mb={6}>
          <Footer />
        </Box>
      </Flex>
      <MobileNav />
    </>
  );
});

const MobileNav = observer(() => {
  const { colorMode } = useColorMode();
  useEffect(() => {
    const closeOnEsc = e => {
      if (e.key === "Escape") {
        if (AppStore.rwd.isMobileNavOpen) {
          AppStore.rwd.toggleMobileNav();
        }
      }
    };
    document.addEventListener("keydown", closeOnEsc);
    return () => {
      document.removeEventListener("keydown", closeOnEsc);
    };
  }, []);
  return (
    <AnimatePresence exitBeforeEnter>
      {AppStore.rwd.isMobileNavOpen && (
        <motion.div
          style={{
            display: "flex",
            position: "absolute",
            width: "100vw",
            height: "100vh",
            zIndex: 100,
            background: "transparent",
            justifyContent: "center",
            alignItems: "center",
            top: 0,
          }}
          initial={{ left: -window.innerWidth }}
          animate={{ left: 0 }}
          exit={{ left: -window.innerWidth }}
          transition={{ duration: 0.25 }}
        >
          <Box
            opacity={0.9}
            position={"absolute"}
            w={"full"}
            h={"full"}
            bg={lightOrDarkMode(colorMode, "yellow.50", "purple.700")}
          />
          <Box zIndex={101}>
            <Flex flexDir={"column"} justifyContent={"center"} alignItems={"center"} gap={5}>
              <NavLinks
                onClick={() => {
                  if (AppStore.rwd.isMobileNavOpen) {
                    AppStore.rwd.toggleMobileNav();
                  }
                }}
                isMobile={AppStore.rwd.isMobile}
                size={"lg"}
              />
            </Flex>
            <Box position={"absolute"} top={5} right={5}>
              <Icon cursor={"pointer"} boxSize={35} icon={"close"} onClick={() => AppStore.rwd.toggleMobileNav()} />
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default AppLayout;

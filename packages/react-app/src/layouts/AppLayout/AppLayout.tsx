import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import Footer from "../../common/Footer/Footer";
import Icon from "../../DSL/Icon/Icon";
import Link from "../../DSL/Link/Link";
import Marquee from "../../DSL/Marquee/Marquee";
import { lightOrDarkMode } from "../../DSL/Theme";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
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
        {/* create space for our header rendered index.tsx */}
        <Box height={"40px"} />
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

export const HeaderMarquee = () => {
  const { colorMode } = useColorMode();
  const linkColor = lightOrDarkMode(colorMode, "yellow.700", "purple.50");
  return (
    <Box
      bg={lightOrDarkMode(colorMode, "black", "purple.700")}
      borderBottom={"1px"}
      borderColor={lightOrDarkMode(colorMode, "black", "white")}
    >
      <Marquee speed={55} pauseOnHover>
        <Box px={4} py={2}>
          <Typography
            variant={TVariant.PresStart12}
            whiteSpace={"pre"}
            color={lightOrDarkMode(colorMode, "white", "white")}
          >
            Own the Doge ... Own a piece of internet history ...{" "}
            <Link
              isExternal
              size={"sm"}
              color={linkColor}
              to={
                "https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0xBAac2B4491727D78D2b78815144570b9f2Fe8899"
              }
            >
              Buy $DOG
            </Link>{" "}
            for very fun ...{" "}
            <Link isExternal to={"https://pixels.ownthedoge.com"} size={"sm"} color={linkColor}>
              Mint Doge Pixels
            </Link>{" "}
            for much wow ... Help guide where the Doge goes next in the{" "}
            <Link isExternal to={"https://dao.ownthedoge.com"} size={"sm"} color={linkColor}>
              Doge DAO
            </Link>
            ...
          </Typography>
        </Box>
      </Marquee>
    </Box>
  );
};

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

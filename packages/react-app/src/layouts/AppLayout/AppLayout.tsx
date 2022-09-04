import React from "react";
import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import AppStore from "../../store/App.store";
import Link from "../../DSL/Link/Link";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { Type } from "../../DSL/Fonts/Fonts";
import NavLinks from "./NavLinks";
import Header from "./Header";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";

interface AppLayoutProps {
  children?: any;
}

const AppLayout = observer(function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Flex flexGrow={1} w={"100vw"} p={{ base: 0, md: 8 }} pb={{ base: 0, md: 3 }} flexDirection={"column"}>
        <Header />
        <Flex grow={1}>
          {children}
        </Flex>
        {AppStore.rwd.isMobile && <MobileNav />}
        {!AppStore.rwd.isMobile && <Footer />}
      </Flex>
    </>
  );
});

const Footer = observer(() => {
  const contributers: { name: string; socialLink: string }[] = [
    { name: "coldplunge", socialLink: "https://twitter.com/xcoldplunge" },
    { name: "gainormather", socialLink: "https://twitter.com/gainormather" },
    { name: "partyka1", socialLink: "https://github.com/partyka1" },
    { name: "nemochips", socialLink: "https://twitter.com/nemo__chips" },
  ];
  return (
    <Box w={"full"} mt={5}>
      <Flex justifyContent={"space-between"}>
        <Box>
          <Typography variant={TVariant.ComicSans10}>
            Built by
            {contributers.map((person, index, arr) => (
              <Link
                size={"sm"}
                key={`${person.name}`}
                fontWeight={"bold"}
                variant={Type.ComicSans}
                mx={1}
                href={person.socialLink}
                isExternal
              >
                {person.name}
                {index === arr.length - 1 ? "" : ","}
              </Link>
            ))}
            with support from
            <Link
              size={"sm"}
              fontWeight={"bold"}
              variant={Type.ComicSans}
              mx={1}
              href={"https://twitter.com/ownthedoge"}
              isExternal
            >
              The Doge NFT
            </Link>
          </Typography>
        </Box>
        <Box>
          {AppStore.web3.usdPerPixel && <Typography variant={TVariant.ComicSans12}>
            ${formatWithThousandsSeparators(AppStore.web3.usdPerPixel)} / pixel
          </Typography>}
        </Box>
      </Flex>
    </Box>
  );
});

const MobileNav = observer(() => {
  const { colorMode } = useColorMode();
  return (
    <Flex
      flexDirection={"column"}
      bottom={0}
      zIndex={3}
      height={"100px"}
      borderTopStyle={"solid"}
      borderTopWidth={"1px"}
      justifyContent={"center"}
      alignItems={"space-around"}
      bg={colorMode === "light" ? "yellow.50" : "purple.700"}
      borderTopColor={colorMode === "light" ? "black" : "white"}
    >
      <Flex justifyContent={"space-around"}>
        <NavLinks isMobile />
      </Flex>
    </Flex>
  );
});

export default AppLayout;

import { Box, Flex, Grid, HStack, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { Type } from "../../DSL/Fonts/Fonts";
import Icon from "../../DSL/Icon/Icon";
import Link from "../../DSL/Link/Link";
import { lightOrDarkMode } from "../../DSL/Theme";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";
import AppStore from "../../store/App.store";
import { readLinks, socialLinks, tradeLinks } from "./Links";

const Footer = observer(() => {
  return (
    <Box>
      <Box flexGrow={1} borderY={1} borderStyle={"solid"} borderColor={"#817d7240"} py={8}>
        <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr 1fr" }} columnGap={10} rowGap={8}>
          <FooterItem title={"Talk"} items={socialLinks} />
          <FooterItem title={"Read"} items={readLinks} />
          <FooterItem title={"Aquire"} items={tradeLinks} />
        </Grid>
      </Box>
      <Flex justifyContent={"flex-end"} alignItems={"center"} mt={5}>
        <HStack justifyContent={"flex-end"} alignItems={"center"} spacing={2} opacity={0.5}>
          <a
            target={"_blank"}
            href={"https://discord.com/invite/thedogenft"}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Icon icon={"discord"} boxSize={5} />
          </a>
          <a
            target={"_blank"}
            href={"https://twitter.com/ownthedoge"}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Icon icon={"twitter"} boxSize={4} />
          </a>
          {AppStore.web3.usdPerPixel && (
            <Typography variant={TVariant.ComicSans14}>
              ${formatWithThousandsSeparators(AppStore.web3.usdPerPixel, 2)}/px
            </Typography>
          )}
        </HStack>
      </Flex>
    </Box>
  );
});

const FooterItem: React.FC<{ title: string; items: { title: string; link: string }[] }> = ({ title, items }) => {
  const { colorMode } = useColorMode();
  return (
    <Box>
      <Typography
        block
        mb={3}
        opacity={0.5}
        color={lightOrDarkMode(colorMode, "black", "white")}
        fontWeight={"bold"}
        variant={TVariant.ComicSans14}
      >
        {title}
      </Typography>
      <Grid templateRows={"1fr 1fr 1fr"}>
        {items.map(item => (
          <Link key={`${item.title}`} opacity={0.5} size="sm" target={"_blank"} variant={Type.ComicSans} href={item.link}>
            {item.title}
          </Link>
        ))}
      </Grid>
    </Box>
  );
};

export default Footer;

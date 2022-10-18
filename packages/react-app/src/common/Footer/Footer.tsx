import { Box, Grid, GridItem, HStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import BigText from "../../DSL/BigText/BigText";
import { Type } from "../../DSL/Fonts/Fonts";
import Icon from "../../DSL/Icon/Icon";
import Link from "../../DSL/Link/Link";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { formatWithThousandsSeparators } from "../../helpers/numberFormatter";
import AppStore from "../../store/App.store";
import { socialLinks, readLinks, actionLinks, tradeLinks } from "./Links";

const Footer = observer(() => {
    return (
      <Box flexGrow={1} borderY={1} borderStyle={"solid"} borderColor={"yellow.100"} py={8}>
        <Grid templateColumns={{base: "1fr", sm: "1fr 1fr", xl: "1fr 1fr 1fr 1fr"}} columnGap={10} rowGap={8}>
          <FooterItem title={"Talk"} items={socialLinks}/>
          <FooterItem title={"Read"} items={readLinks}/>
          <FooterItem title={"Do"} items={actionLinks}/>
          <FooterItem title={"Aquire"} items={tradeLinks}/>
        </Grid>

        <HStack mt={5} justifyContent={"flex-end"} alignItems={"center"} spacing={2}>
          <a
            target={"_blank"}
            href={"https://discord.com/invite/thedogenft"}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Icon icon={"discord"} boxSize={5} />
          </a>
          <a target={"_blank"} href={"https://twitter.com/ownthedoge"} style={{ display: "flex", alignItems: "center" }}>
            <Icon icon={"twitter"} boxSize={4} />
          </a>
          {AppStore.web3.usdPerPixel && (
            <Typography variant={TVariant.ComicSans14}>
              ${formatWithThousandsSeparators(AppStore.web3.usdPerPixel, 2)} / pixel
            </Typography>
          )}
        </HStack>
      </Box>
    );
  });

const FooterItem: React.FC<{title: string, items: {title: string, link: string}[]}> = ({title, items}) => {
  return <Box>
    <Typography fontWeight={"bold"} color={"yellow.100"} variant={TVariant.ComicSans14}>{title}</Typography>
    <Grid templateRows={"1fr 1fr 1fr"}>
      {items.map(item => <Link color={"yellow.100"} size="sm" target={"_blank"} variant={Type.ComicSans} href={item.link}>{item.title}</Link>)}
    </Grid>
  </Box>
}

export default Footer

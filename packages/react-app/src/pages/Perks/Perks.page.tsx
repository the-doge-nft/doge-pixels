import { Box, css, Flex, useColorMode, useMultiStyleConfig } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import PerksStore, { PerkItem } from "./Perks.store";
import Button, { ButtonVariant } from "../../DSL/Button/Button";
import { lightOrDarkMode } from "../../DSL/Theme";
import Pill from "../../DSL/Pill/Pill";

const PerksPage = observer(() => {
  const store = useMemo(() => new PerksStore(), []);
  return (
    <Box w={"full"} mt={6} p={{ base: 8, md: 0 }}>
      <Typography mb={4} block textAlign={"center"} variant={TVariant.PresStart24}>
        Pixel Perks
      </Typography>
      <Flex justifyContent={"center"}>
        <Box maxW={"3xl"}>
          <Box textAlign={"center"}>
            <Typography variant={TVariant.ComicSans16}>
              Wondering what a pixel gets you & how is it your first class ticket to Doge entertainment? Think no
              further, checkout the past and present of our Pixel Perks below.
            </Typography>
          </Box>
          <Flex flexDirection={"column"} sx={{ gap: "20px" }} mt={8}>
            {store.items.map(item => (
              <Perk item={item} />
            ))}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
});

const Perk: React.FC<{ item: PerkItem }> = ({ item }) => {
  const { title, description, link, date } = item;
  const { colorMode } = useColorMode();
  const styles = useMultiStyleConfig("Button", { size: "md", variant: ButtonVariant.Primary });
  return (
    <a href={link} target={"_blank"}>
      <Box position={"relative"} display={"inline-block"} zIndex={1} __css={styles.container} w={"full"}>
        <Flex
          __css={styles.button}
          w={"full"}
          alignItems={"flex-start"}
          flexDirection={"column"}
          justifyContent={"flex-start"}
        >
          <Typography variant={TVariant.PresStart16}>{title}</Typography>
          <Typography mt={2} variant={TVariant.ComicSans14}>
            {description}
          </Typography>
          <Flex justifyContent={"flex-end"} w={"full"}>
            <Typography
              mt={1}
              textAlign={"right"}
              variant={TVariant.ComicSans12}
              color={lightOrDarkMode(colorMode, "yellow.100", "gray.300")}
            >
              {date}
            </Typography>
          </Flex>
        </Flex>
        <Box
          //@ts-ignore
          __css={styles.drop}
        />
        {item.isLive && (
          <Box position={"absolute"} top={-2} right={-2}>
            <Pill>Live</Pill>
          </Box>
        )}
      </Box>
    </a>
  );
};

export default PerksPage;

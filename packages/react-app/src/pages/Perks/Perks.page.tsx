import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import PerksStore, { PerkItem } from "./Perks.store";
import Button from "../../DSL/Button/Button";
import { lightOrDarkMode } from "../../DSL/Theme";

const PerksPage = observer(() => {
  const store = useMemo(() => new PerksStore(), [])
  return <Box w={"full"}>
    <Flex justifyContent={"center"}>
      <Box maxW={"3xl"}>
        <Box textAlign={"center"}>
          <Typography variant={TVariant.ComicSans16}>
            Pixel perks offer beneficial assets to our pixel holders. Checkout what has happpened and whats upcoming.
          </Typography>
        </Box>
        <Flex flexDirection={"column"} sx={{gap: "20px"}} mt={8}>
          {store.items.map(item => <Perk item={item}/>)}
        </Flex>
      </Box>
    </Flex>
  </Box>
})

const Perk: React.FC<{item: PerkItem}> = ({ item }) => {
  const {title, description, link, date} = item
  const { colorMode } = useColorMode()
  return <a href={link} target={"_blank"}>
    <Button w={"full"}>
      <Flex w={"full"} textAlign={"left"} flexDirection={"column"} justifyContent={"flex-start"}>
        <Typography variant={TVariant.PresStart16}>{title}</Typography>
        <Typography mt={2} variant={TVariant.ComicSans14}>{description}</Typography>
        <Typography mt={1} textAlign={'right'} variant={TVariant.ComicSans12} color={lightOrDarkMode(colorMode, "yellow.100", "gray.300")}>{date}</Typography>
      </Flex>
    </Button>
  </a>
}

export default PerksPage

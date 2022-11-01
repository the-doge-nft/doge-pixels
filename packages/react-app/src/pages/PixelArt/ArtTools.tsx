import { Box, useColorMode, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import Icon, { IconName } from "../../DSL/Icon/Icon";
import { darkModeSecondary, lightModePrimary, lightOrDarkMode } from "../../DSL/Theme";
import Tooltip from "../../DSL/Tooltip/Tooltip";
import PixelArtPageStore from "./PixelArtPage.store";
import { pixelArtTools } from "./PixelArtTools";

const ArtTools = observer(({ store }: { store: PixelArtPageStore }) => {
  const { colorMode } = useColorMode();
  return (
    <Box margin={"5px"}>
      <VStack spacing={3}>
        <VStack spacing={1}>
          {pixelArtTools.map((entry, index: number) => {
            return (
              <Tooltip offset={[0, 14]} placement={"left"} label={entry.description}>
                <ArtToolIcon
                  icon={entry.icon}
                  key={`art-tool-${index}`}
                  bg={
                    store.selectedToolIndex === index
                      ? colorMode === "light"
                        ? lightModePrimary
                        : darkModeSecondary
                      : "inherit"
                  }
                  onClick={() => (store.selectedToolIndex = index)}
                />
              </Tooltip>
            );
          })}
        </VStack>
        <Box
          borderTopWidth={1}
          borderColor={lightOrDarkMode(colorMode, "black", "white")}
          h={"1px"}
          w={"full"}
          my={10}
        />
        <Tooltip offset={[0, 14]} placement={"left"} label={"Toggle template"}>
          <ArtToolIcon
            bg={store.isTemplateVisible ? lightOrDarkMode(colorMode, lightModePrimary, darkModeSecondary) : "inherit"}
            onClick={() => store.toggleTemplateVisibility()}
            icon={"templateToggle"}
          />
        </Tooltip>
      </VStack>
    </Box>
  );
});

const ArtToolIcon = ({ bg, onClick, icon }: { bg: any; onClick: () => void; icon: IconName }) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      cursor={"pointer"}
      borderWidth={1}
      borderColor={lightOrDarkMode(colorMode, "black", "white")}
      p={0.5}
      bg={bg}
      _hover={{ bg: colorMode === "light" ? lightModePrimary : darkModeSecondary }}
      onClick={onClick}
    >
      <Icon icon={icon} boxSize={7} fill={lightOrDarkMode(colorMode, "black", "white")} />
    </Box>
  );
};

export default ArtTools;

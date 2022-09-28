import {observer} from "mobx-react-lite";
import PixelArtPageStore from "./PixelArtPage.store";
import {Box, GridItem, useColorMode, VStack} from "@chakra-ui/react";
import {pixelArtTools} from "./PixelArtTools";
import {darkModeSecondary, lightModePrimary, lightOrDarkMode} from "../../DSL/Theme";
import Icon, {IconName} from "../../DSL/Icon/Icon";

const ArtTools = observer(({ store }: { store: PixelArtPageStore }) => {
    const { colorMode } = useColorMode();
    return (
        <Box margin={"5px"}>
            <VStack spacing={1}>
                {pixelArtTools.map((entry: any, index: number) => {
                    return (
                        <ArtToolIcon
                            icon={entry.icon}
                            key={`art-tool-${index}`}
                            bg={store.selectedToolIndex === index
                            ? colorMode === "light"
                                ? lightModePrimary
                                : darkModeSecondary
                            : "inherit"}
                            onClick={() => store.selectedToolIndex = index}
                        />
                    );
                })}
                <Box borderTopWidth={1} borderColor={lightOrDarkMode(colorMode, 'black', 'white')} m={"3px"} h={"1px"} w={"90%"} marginTop={"5px"} />
                <ArtToolIcon
                    bg={store.isTemplateVisible ? ( lightOrDarkMode(colorMode, lightModePrimary, darkModeSecondary)) : "inherit"}
                    onClick={() => store.toggleTemplateVisibility()}
                    icon={"templateToggle"}
                />
            </VStack>
        </Box>
    );
});

const ArtToolIcon = ({bg, onClick, icon}: {bg: any, onClick: () => void, icon: IconName}) => {
    const {colorMode} = useColorMode()
    return <Box
        cursor={'pointer'}
        borderWidth={1}
        borderColor={lightOrDarkMode(colorMode,'black', 'white')}
        p={0.5}
        bg={bg}
        _hover={{ bg: colorMode === "light" ? lightModePrimary : darkModeSecondary }}
        onClick={onClick}
    >
        <Icon icon={icon} boxSize={7} fill={lightOrDarkMode(colorMode, "black", "white")} />
    </Box>
}

export default ArtTools

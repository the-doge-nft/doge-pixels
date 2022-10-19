import { observer } from "mobx-react-lite";
import PixelArtPageStore from "./PixelArtPage.store";
import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AppStore from "../../store/App.store";
import { PixelArtTool } from "./PixelArtTools";
import { lightOrDarkMode } from "../../DSL/Theme";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import PixelPane from "../../DSL/PixelPane/PixelPane";

const ArtPalette = observer(({ store }: { store: PixelArtPageStore }) => {
  const { colorMode } = useColorMode();
  return (
    <Box margin={"10px"}>
      <Flex flexDirection={"row"}>
        <Box>
          {store.palette[store.selectedBrushPixelIndex] && store.selectedToolIndex !== PixelArtTool.erase && (
            <PixelPane
              size={"xs"}
              onClick={() => console.log()}
              pupper={store.palette[store.selectedBrushPixelIndex].tokenId}
            />
          )}
          {store.selectedToolIndex === PixelArtTool.erase && (
            <>
              <Box
                w={"70px"}
                h={"70px"}
                borderWidth={1}
                borderColor={lightOrDarkMode(colorMode, "black", "white")}
                background={
                  "linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), white"
                }
                backgroundRepeat={"repeat, repeat"}
                backgroundPosition={"0px 0, 8px 8px"}
                transformOrigin={"0 0 0"}
                backgroundClip={"border-box, border-box"}
                backgroundSize={"16px 16px, 16px 16px"}
              />
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                w={"70px"}
                h={"25px"}
                borderWidth={"1px"}
                borderTopWidth={"0px"}
                borderColor={"black"}
              >
                <Typography variant={TVariant.PresStart8}>erase</Typography>
              </Flex>
            </>
          )}
        </Box>
        <Box borderRightWidth={1} borderColor={lightOrDarkMode(colorMode, "black", "white")} w={"1px"} mx={3} />
        <Flex flexDir={"column"} flexGrow={1}>
          <Flex
            overflowX={"hidden"}
            overflowY={"auto"}
            gap={1}
            maxWidth={AppStore.rwd.isMobile ? "240px" : "432px"}
            maxHeight={AppStore.rwd.isMobile ? "80px" : "240px"}
            flexWrap={"wrap"}
            alignContent={"flex-start"}
            flexGrow={1}
          >
            {store.palette.map((entry, index: number) => {
              return (
                <Box
                  boxSize={"24px"}
                  bgColor={entry.hex}
                  cursor={"pointer"}
                  key={index}
                  borderWidth={1}
                  borderColor={lightOrDarkMode(colorMode, "black", "white")}
                  onClick={() => {
                    store.selectedBrushPixelIndex = index;
                    store.selectedToolIndex = PixelArtTool.pen;
                  }}
                />
              );
            })}
          </Flex>
          <Flex justifyContent={"space-between"} w={"full"} mt={1}>
            <Typography variant={TVariant.ComicSans12} color={lightOrDarkMode(colorMode, "yellow.100", "gray.400")}>
              {store.isRandomPaletteActive
                ? "Random Pixels from The Doge NFT"
                : `${AppStore.web3.addressForDisplay}'s pixels`}
            </Typography>
            <Typography variant={TVariant.ComicSans12} color={lightOrDarkMode(colorMode, "yellow.100", "gray.400")}>
              ({store.palette.length})
            </Typography>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
});

export default ArtPalette;

import { Box, Flex, Input, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import PixelPane from "../../DSL/PixelPane/PixelPane";
import { lightOrDarkMode } from "../../DSL/Theme";
import Tooltip from "../../DSL/Tooltip/Tooltip";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import AppStore from "../../store/App.store";
import PixelArtPageStore from "./PixelArtPage.store";
import { PixelArtTool } from "./PixelArtTools";

const ArtPalette = observer(({ store }: { store: PixelArtPageStore }) => {
  const { colorMode } = useColorMode();
  const [showCustomInput, setShowCustomInput] = useState(false);
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
              const [x, y] = AppStore.web3.pupperToPixelCoordsLocal(entry.tokenId);
              return (
                <Tooltip label={`(${x}, ${y})`}>
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
                </Tooltip>
              );
            })}
          </Flex>
          <Flex justifyContent={"space-between"} w={"full"} mt={1}>
            <Typography variant={TVariant.ComicSans12} color={lightOrDarkMode(colorMode, "yellow.100", "gray.400")}>
              {store.selectedTypeDescription}
            </Typography>
            <Flex alignItems={"center"} gap={2}>
              {store.showCustomInput && (
                <Flex alignItems={"center"} gap={2}>
                  <button onClick={() => setShowCustomInput(!showCustomInput)}>
                    <Typography
                      variant={TVariant.ComicSans20}
                      color={lightOrDarkMode(colorMode, "yellow.100", "gray.400")}
                    >
                      {showCustomInput ? "-" : "+"}
                    </Typography>
                  </button>
                  {showCustomInput && <CustomPixelInput store={store} />}
                </Flex>
              )}
              <Typography variant={TVariant.ComicSans12} color={lightOrDarkMode(colorMode, "yellow.100", "gray.400")}>
                ({store.palette.length})
              </Typography>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
});

const CustomPixelInput: React.FC<{ store: PixelArtPageStore }> = observer(({ store }) => {
  const [x, setX] = useState<number | undefined>();
  const [y, setY] = useState<number | undefined>();
  const [pixelId, setPixelId] = useState<number | undefined>();
  const { colorMode } = useColorMode();
  useEffect(() => {
    if (x && y) {
      const pixelId = AppStore.web3.coordinateToPupperLocal(x, y);
      try {
        const hex = AppStore.web3.pupperToHexLocal(pixelId);
        console.log(pixelId);
        if (hex !== undefined) {
          setPixelId(pixelId);
        }
      } catch (e) {
        setPixelId(undefined);
      }
    }
  }, [x, y]);
  return (
    <Flex gap={2} alignItems={"center"}>
      {pixelId && <PixelPane size={"xxs"} pupper={pixelId} />}
      <Input
        w={10}
        h={6}
        fontSize={8}
        padding={0}
        textAlign="center"
        borderRadius={0}
        type="number"
        onChange={(e: any) => setX(Number(e.target.value))}
        value={x}
        max={640}
        min={1}
        placeholder={"x"}
      />
      <Input
        w={10}
        h={6}
        fontSize={8}
        padding={0}
        textAlign="center"
        borderRadius={0}
        type="number"
        onChange={(e: any) => setY(Number(e.target.value))}
        value={y}
        max={480}
        min={1}
        placeholder={"y"}
      />
      <Flex flexDir={"column"} alignItems={"center"}>
        <Typography
          cursor={pixelId ? "pointer" : "not-allowed"}
          onClick={() => {
            store.customPixelsPalette.push({ tokenId: pixelId, hex: AppStore.web3.pupperToHexLocal(pixelId) });
          }}
          variant={TVariant.ComicSans12}
          color={lightOrDarkMode(colorMode, "yellow.100", "gray.400")}
        >
          add
        </Typography>
        <Typography
          cursor={store.customPixelsPalette.length > 0 ? "pointer" : "not-allowed"}
          onClick={() => (store.customPixelsPalette = [])}
          variant={TVariant.ComicSans12}
          color={lightOrDarkMode(colorMode, "yellow.100", "gray.400")}
        >
          remove all
        </Typography>
        <Typography
          cursor={store.paletteType !== "custom" ? "pointer" : "not-allowed"}
          onClick={() => (store.paletteType = "custom")}
          variant={TVariant.ComicSans12}
          color={lightOrDarkMode(colorMode, "yellow.100", "gray.400")}
        >
          custom only
        </Typography>
      </Flex>
    </Flex>
  );
});

export default ArtPalette;

import { Box, Flex, GridItem, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import Pane from "../../DSL/Pane/Pane";
import { lightOrDarkMode } from "../../DSL/Theme";
import { isProduction } from "../../environment/helpers";
import AppStore from "../../store/App.store";
import ArtCanvas from "./ArtCanvas";
import ArtMenu from "./ArtMenu";
import ArtPalette from "./ArtPalette";
import ArtTools from "./ArtTools";
import CanvasPropertiesModal from "./CanvasPropertiesModal";
import ImportStickerModal from "./ImportStickerModal";
import ImportTemplateModal from "./ImportTemplateModal";
import PaletteModal from "./PaletteModal";
import PixelArtPageStore from "./PixelArtPage.store";

const PixelArtPage = observer(function PixelArtPage() {
  const store = useMemo(() => new PixelArtPageStore(), []);
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (isProduction()) store.selectedAddress = AppStore.web3.address ? AppStore.web3.address : "";

    document.addEventListener("keydown", handleHotkeys, false);

    return () => {
      document.removeEventListener("keydown", handleHotkeys);
    };
  });

  useEffect(() => {
    if (isProduction()) store.selectedAddress = AppStore.web3.address ? AppStore.web3.address : "";
  }, [AppStore.web3.address]);

  const handleHotkeys = (e: KeyboardEvent) => {
    const ctrlPressed = window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey;
    if (ctrlPressed && e.shiftKey && e.code === "KeyZ") {
      e.preventDefault();
      store.redoAction();
    } else if (ctrlPressed && e.code === "KeyZ") {
      e.preventDefault();
      store.undoAction();
    } else if (ctrlPressed && e.code === "KeyS") {
      e.preventDefault();
      store.saveProject();
    }
  };

  return (
    <Flex flexGrow={1} justifyContent={"center"} alignItems={"center"}>
      <Box>
        <Pane maxH={AppStore.rwd.isMobile ? "520px" : "800px"} maxW={"fit-content"} padding={"2px"}>
          <Flex flexDirection={"column"} flexGrow={0}>
            <ArtMenu store={store} />
            <Box
              borderTopWidth={"1px"}
              borderColor={lightOrDarkMode(colorMode, "black", "white")}
              mx={"10px"}
              mt={1}
              mb={2}
            />
            <GridItem display={"flex"} flexDirection={"row"} flexGrow={0}>
              <ArtTools store={store} />
              <ArtCanvas store={store} />
            </GridItem>
            <Box
              borderTopWidth={"1px"}
              borderColor={lightOrDarkMode(colorMode, "black", "white")}
              mx={"10px"}
              my={2}
              mb={1}
            />
            <ArtPalette store={store} />
          </Flex>
          <a id={"pfp-link"} />
        </Pane>
      </Box>
      {store.isImportTemplateModalOpened && (
        <ImportTemplateModal
          store={store}
          isOpen={store.isImportTemplateModalOpened}
          onClose={() => {
            store.isImportTemplateModalOpened = false;
          }}
        />
      )}
      {store.isImportStickerModalOpened && (
        <ImportStickerModal
          store={store}
          isOpen={store.isImportStickerModalOpened}
          onClose={() => {
            store.isImportStickerModalOpened = false;
          }}
        />
      )}
      {store.isCanvasPropertiesModalOpened && (
        <CanvasPropertiesModal
          store={store}
          isOpen={store.isCanvasPropertiesModalOpened}
          onClose={() => {
            store.isCanvasPropertiesModalOpened = false;
          }}
        />
      )}
      {store.isPaletteModalOpened && (
        <PaletteModal
          store={store}
          isOpen={store.isPaletteModalOpened}
          onClose={() => (store.isPaletteModalOpened = false)}
        />
      )}
    </Flex>
  );
});

export default PixelArtPage;

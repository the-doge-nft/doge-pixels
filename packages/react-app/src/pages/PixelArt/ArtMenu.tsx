import { observer } from "mobx-react-lite";
import PixelArtPageStore from "./PixelArtPage.store";
import { ClearCanvasAction, IdenticonAction } from "./PixelArtActions";
import shareToTwitter, { TwitterShareType } from "../../helpers/shareToTwitter";
import { Box, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import AppStore from "../../store/App.store";

const ArtMenu = observer(({ store }: { store: PixelArtPageStore }) => {
  const newFile = () => {
    store.newProject();
  };
  const saveFile = () => {
    store.saveProject();
  };
  const undoAction = () => {
    store.undoAction();
  };
  const redoAction = () => {
    store.redoAction();
  };
  const clearCanvas = () => {
    const clearAction = new ClearCanvasAction(store);
    if (clearAction.isValid()) {
      store.pushAction(clearAction);
    }
  };

  const downloadPFP = () => {
    let canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    store.pixelsCanvas.drawStickers(store.stickers);
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

    var link = document.getElementById("pfp-link");
    if (link) {
      link.setAttribute("download", "wowsome_pfp.png");
      link.setAttribute("href", image);
      link.click();
    }
    store.pixelsCanvas.updateCanvas();
  };

  const postTweet = () => {
    const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    store.pixelsCanvas.drawStickers(store.stickers);
    const data = canvas.toDataURL().replace("data:image/png;base64,", "");
    store.pixelsCanvas.updateCanvas();
    shareToTwitter(data, "I just created pixel art with my Doge Pixels. Check it out here.", TwitterShareType.Art);
  };

  const importTemplate = () => {
    store.isImportTemplateModalOpened = true;
  };

  const importSticker = () => {
    store.isImportStickerModalOpened = true;
  };

  const generateIdenticon = () => {
    let action = new IdenticonAction(store);
    action.do(store);
    store.pushAction(action);
  };

  const canvasProperties = () => {
    store.isCanvasPropertiesModalOpened = true;
  };

  const changePalette = () => {
    store.isPaletteModalOpened = true;
  };

  return (
    <Box>
      <Menu>
        <MenuButton fontSize={"xs"} border={"none"} bg={"none"}>
          <Typography variant={TVariant.PresStart15}>File</Typography>
        </MenuButton>
        <MenuList pt={0}>
          <MenuItem onClick={newFile}>New File</MenuItem>
          <MenuItem onClick={saveFile}>Save File</MenuItem>
          <MenuItem onClick={downloadPFP}>Export</MenuItem>
          <MenuItem onClick={postTweet}>Share</MenuItem>
          <MenuItem onClick={importTemplate}>Import Template</MenuItem>
          <MenuItem onClick={importSticker}>Import Sticker</MenuItem>
          {AppStore.web3.isConnected && <MenuItem onClick={generateIdenticon}>Randomize</MenuItem>}
          <MenuItem onClick={canvasProperties}>Properties</MenuItem>
          <MenuItem onClick={changePalette}>Palette</MenuItem>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton border={"none"} bg={"none"}>
          <Typography variant={TVariant.PresStart15}>Edit</Typography>
        </MenuButton>
        <MenuList pt={0}>
          <MenuItem disabled={store.undoActions.length === 0} onClick={undoAction}>
            Undo
          </MenuItem>
          <MenuItem disabled={store.redoActions.length === 0} onClick={redoAction}>
            Redo
          </MenuItem>
          <MenuItem onClick={clearCanvas}>Clear</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
});

export default ArtMenu;

import { observer } from "mobx-react-lite";
import Modal from "../../DSL/Modal/Modal";
import { Box, Flex } from "@chakra-ui/react";
import PixelArtPageStore from "./PixelArtPage.store";
import Button from "../../DSL/Button/Button";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import AppStore from "../../store/App.store";

interface PaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: PixelArtPageStore;
}

const PaletteModal = observer(({ isOpen, onClose, store }: PaletteModalProps) => {
  return (
    <Modal size={"lg"} isOpen={isOpen} onClose={onClose} title={"Palette"} description={"Select your pixel palette"}>
      <Flex flexDir={"column"} mt={4} gap={4}>
        {!AppStore.web3.isConnected && <Button isDisabled>Your Pixels (connect wallet)</Button>}
        {AppStore.web3.isConnected && AppStore.web3.puppersOwned.length === 0 && (
          <Button>No Pixels Owned Min here</Button>
        )}
        {AppStore.web3.isConnected && AppStore.web3.puppersOwned.length !== 0 && (
          <PaletteButton isSelected={store.paletteType === "user"} onClick={() => (store.paletteType = "user")}>
            Your Pixels ({store.userPalette.length})
          </PaletteButton>
        )}
        <Flex>
          <Box flexGrow={1}>
            <PaletteButton isSelected={store.paletteType === "random"} onClick={() => (store.paletteType = "random")}>
              Random ({store.randomPalette.length})
            </PaletteButton>
          </Box>
          {store.paletteType === "random" && (
            <Button ml={5} onClick={() => store.getRandomPalette()}>
              Randomize
            </Button>
          )}
        </Flex>
      </Flex>
    </Modal>
  );
});

const PaletteButton = ({ isSelected, onClick, children }: any) => {
  return (
    <Button w={"full"} isDisabled={isSelected} onClick={onClick}>
      <Flex>
        {isSelected && <Typography variant={TVariant.ComicSans12}>✨</Typography>}
        {children}
        {isSelected && <Typography variant={TVariant.ComicSans12}>✨</Typography>}
      </Flex>
    </Button>
  );
};

export default PaletteModal;

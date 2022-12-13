import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import MemeModal from "../../DSL/Modal/MemeModal";
import Modal from "../../DSL/Modal/Modal";
import ScrollHelperModal from "../../DSL/Modal/ScrollHelperModal";
import AppStore from "../../store/App.store";
import BurnPixelsModal from "./BurnPixelsModal/BurnPixelsModal";
import MintPixelsModal from "./MintPixelsModal/MintPixelsModal";
import IndexPane from "./Panes/IndexPane";
import ManagePane from "./Panes/ManagePane";
import SelectedPixelPane from "./Panes/SelectedPixelPane";
import ViewerStore from "./Viewer.store";

const Modals: React.FC<{ store: ViewerStore }> = observer(({ store }) => {
  return (
    <>
      {AppStore.modals.isInfoModalOpen && (
        <Modal
          defaultPosition={AppStore.rwd.isMobile ? {} : { x: window.innerWidth / 5, y: window.innerHeight / 6 }}
          title={"Own The Doge"}
          onClose={() => AppStore.modals.toggleInfoModal()}
          isOpen={AppStore.modals.isInfoModalOpen}
        >
          <Box display={"flex"} flexDirection={"column"} justifyContent={"space-between"}>
            <IndexPane store={store} />
          </Box>
        </Modal>
      )}
      {AppStore.modals.isSelectedPixelModalOpen && (
        <Modal
          defaultPosition={{
            x: AppStore.rwd.isMobile ? window.innerWidth / 7 : window.innerWidth / 3,
            y: window.innerHeight / 4,
          }}
          onClose={() => (AppStore.modals.isSelectedPixelModalOpen = false)}
          isOpen={AppStore.modals.isSelectedPixelModalOpen}
        >
          <SelectedPixelPane store={store} />
        </Modal>
      )}
      {AppStore.modals.isMyPixelsModalOpen && (
        <Modal
          defaultPosition={{ x: window.innerWidth / 3, y: -window.innerHeight / 4 }}
          onClose={() => (AppStore.modals.isMyPixelsModalOpen = false)}
          isOpen={AppStore.modals.isMyPixelsModalOpen}
        >
          <ManagePane store={store} />
        </Modal>
      )}
      {AppStore.modals.isMintModalOpen && (
        <MintPixelsModal
          isOpen={AppStore.modals.isMintModalOpen}
          onClose={() => (AppStore.modals.isMintModalOpen = false)}
          onSuccess={() => {
            AppStore.modals.isMintMemeModalOpen = true;
          }}
          goToPixels={() => {
            AppStore.modals.isMintModalOpen = false;
            AppStore.modals.isMintMemeModalOpen = false;
          }}
        />
      )}
      {AppStore.modals.isBurnModalOpen && (
        <BurnPixelsModal
          defaultPixel={store.selectedPupper}
          isOpen={AppStore.modals.isBurnModalOpen}
          onClose={() => (AppStore.modals.isBurnModalOpen = false)}
          onSuccess={burnedPixelIDs => {
            AppStore.modals.isBurnMemeModalOpen = true;
            if (store.selectedPupper) {
              if (burnedPixelIDs.includes(store.selectedPupper)) {
                store.getTokenOwner(store.selectedPupper);
              }
            }
          }}
          onCompleteClose={() => {
            AppStore.modals.isBurnModalOpen = false;
            AppStore.modals.isBurnMemeModalOpen = false;
          }}
        />
      )}
      {AppStore.modals.isScrollModalOpen && !AppStore.rwd.isMobile && (
        <ScrollHelperModal
          isOpen={AppStore.modals.isScrollModalOpen}
          onClose={() => (AppStore.modals.isScrollModalOpen = false)}
        />
      )}
      {AppStore.modals.isMintMemeModalOpen && (
        <MemeModal
          type={"mint"}
          isOpen={AppStore.modals.isMintMemeModalOpen}
          onClose={() => (AppStore.modals.isMintMemeModalOpen = false)}
        />
      )}
      {AppStore.modals.isBurnMemeModalOpen && (
        <MemeModal
          type={"burn"}
          isOpen={AppStore.modals.isBurnMemeModalOpen}
          onClose={() => (AppStore.modals.isBurnMemeModalOpen = false)}
        />
      )}
    </>
  );
});

export default Modals;

import React, {Suspense, useCallback, useEffect, useMemo} from "react";
import {Box, Flex} from "@chakra-ui/react";
import DogeExplorer from "./DogeExplorer";
import ViewerStore from "./Viewer.store";
import {observer} from "mobx-react-lite";
import Pane from "../../DSL/Pane/Pane";
import BurnPixelsModal from "./BurnPixelsModal/BurnPixelsModal";
import ManagePane from "./Panes/ManagePane";
import IndexPane from "./Panes/IndexPane";
import MintPixelsModal from "./MintPixelsModal/MintPixelsModal";
import SelectedPixelPane from "./Panes/SelectedPixelPane";
import AppStore from "../../store/App.store";
import Loading from "../../DSL/Loading/Loading";
import ScrollHelperModal from "../../DSL/Modal/ScrollHelperModal";
import MemeModal from "../../DSL/Modal/MemeModal";
import {useLocation, useParams} from "react-router-dom";
import {NamedRoutes, route, SELECTED_PIXEL_PARAM} from "../../App.routes";
import Modal from "../../DSL/Modal/Modal";

/*
  Hack to reload page even if we are already on the route that renders this page
  https://github.com/remix-run/react-router/issues/7416
 */
const ReloadViewerPage = () => {
  const location = useLocation();
  return <ViewerPage key={location.key} />;
};

const ViewerPage = observer(function ViewerPage() {
  const params = useParams<any>();
  const defaultPixel = params?.[SELECTED_PIXEL_PARAM];
  const store = useMemo(() => new ViewerStore(defaultPixel), [defaultPixel]);

  useEffect(() => {
    store.init();
    return () => {
      store.destroy();
    };
    // eslint-disable-next-line
  }, []);

  // Hack to re-render page even if we are already on said page
  // const location = useLocation();
  // useEffect(() => {}, [location.key]);

  return (
    <>
      <Flex flexGrow={1}>
        <Pane w={"full"} h={"full"} p={0}>
          <Suspense
            fallback={
              <Flex justifyContent={"center"} alignItems={"center"} position={"absolute"} w={"full"} h={"full"}>
                <Loading />
              </Flex>
            }
          >
            <DogeExplorer store={store} />
          </Suspense>
        </Pane>
      </Flex>
      {AppStore.modals.isViewerModalOpen && (
        <Modal
          defaultPosition={null}
          title={"Own The Doge"}
          onClose={() => (AppStore.modals.isViewerModalOpen = false)}
          isOpen={true}
        >
          <Box display={"flex"} flexDirection={"column"} justifyContent={"space-between"}>
            <IndexPane store={store} />
          </Box>
        </Modal>
      )}
      {AppStore.modals.isSelectedPixelModalOpen && (
        <Modal
          defaultPosition={{x: window.innerWidth / 3, y: window.innerHeight / 4}}
          onClose={() => (AppStore.modals.isSelectedPixelModalOpen = false)}
          isOpen={AppStore.modals.isSelectedPixelModalOpen}
        >
          <SelectedPixelPane store={store} />
        </Modal>
      )}
      {AppStore.modals.isMyPixelsModalOpen && (
        <Modal
          defaultPosition={{x: window.innerWidth / 3, y: -window.innerHeight / 4}}
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
      {AppStore.modals.isScrollModalOpen && (
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

export default ReloadViewerPage;

import React, { Suspense, useCallback, useEffect, useMemo } from "react";
import { Box, Flex } from "@chakra-ui/react";
import DogeExplorer from "./DogeExplorer";
import ViewerStore, { ViewerView } from "./Viewer.store";
import { observer } from "mobx-react-lite";
import Pane from "../../DSL/Pane/Pane";
import BurnPixelsModal from "./BurnPixelsModal/BurnPixelsModal";
import ManagePane from "./Panes/ManagePane";
import IndexPane from "./Panes/IndexPane";
import MintPixelsModal from "./MintPixelsModal/MintPixelsModal";
import SelectedPixelPane from "./Panes/SelectedPixelPane";
import AppStore from "../../store/App.store";
import Icon from "../../DSL/Icon/Icon";
import Loading from "../../DSL/Loading/Loading";
import ScrollHelperModal from "../../DSL/Modal/ScrollHelperModal";
import MemeModal from "../../DSL/Modal/MemeModal";
import Drawer from "../../DSL/Drawer/Drawer";
import { useLocation, useParams } from "react-router-dom";
import { NamedRoutes, route, SELECTED_PIXEL_PARAM } from "../../App.routes";
import Modal from "../../DSL/Modal/Modal";

/*
  Hack to reload page even if we are already on the route that renders this page
  https://github.com/remix-run/react-router/issues/7416
 */
const ReloadViewerPage = () => {
  const location = useLocation();
  return <ViewerPage key={location.key} />;
};

export type onPixelSelectType = (x: number, y: number) => void;

const ViewerPage = observer(function ViewerPage() {
  const params = useParams<any>();
  let defaultPixel: number | null = null;
  if (SELECTED_PIXEL_PARAM in params) {
    if (AppStore.web3.isPixelIDValid(Number(params[SELECTED_PIXEL_PARAM]))) {
      defaultPixel = Number(params[SELECTED_PIXEL_PARAM]);
    }
  }
  const store = useMemo(() => new ViewerStore(defaultPixel), [defaultPixel]);

  useEffect(() => {
    store.init();
    return () => {
      store.destroy();
    };
    // eslint-disable-next-line
  }, []);

  // Hack to re-render page even if we are already on said page
  const location = useLocation();
  useEffect(() => {}, [location.key]);

  const onPixelSelect: onPixelSelectType = useCallback((x: number, y: number) => {
    store.selectedPupper = AppStore.web3.coordinateToPupperLocal(x, y);
    if (!store.modals.isViewerModalOpen) {
      store.modals.isViewerModalOpen = true
    }
    window.history.pushState({}, "", route(NamedRoutes.PIXELS, { [SELECTED_PIXEL_PARAM]: store.selectedPupper }));

    if (store.currentView !== ViewerView.Selected) {
      store.pushNavigation(ViewerView.Selected);
    }
    if (AppStore.rwd.isMobile) {
      store.isSelectedDrawerOpen = true;
    }
    // eslint-disable-next-line
  }, []);
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
            <DogeExplorer onPixelSelect={onPixelSelect} store={store} />
          </Suspense>
        </Pane>
        {store.modals.isViewerModalOpen && <Modal
          title={store.currentView === ViewerView.Index ? "Own the Doge" : ""}
          onClose={() => store.modals.isViewerModalOpen = false}
          isOpen={true}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
          >
            {store.showGoBack && (
              <Box mt={8} position={"relative"} left={"-20px"} top={"-20px"}>
                <Box
                  p={0}
                  _hover={{ cursor: "pointer" }}
                  _active={{ transform: "translate(4px, 4px)" }}
                  onClick={() => {
                    store.popNavigation();
                    store.clearSelectedPupper();
                  }}
                >
                  <Icon icon={"back"} boxSize={6} />
                </Box>
              </Box>
            )}
            {store.currentView === ViewerView.Index && <IndexPane store={store} />}
            {store.currentView === ViewerView.Manage && <ManagePane store={store} />}
            {store.currentView === ViewerView.Selected && <SelectedPixelPane store={store} />}
          </Box>
        </Modal>}
      </Flex>
      {store.modals.isMintModalOpen && (
        <MintPixelsModal
          isOpen={store.modals.isMintModalOpen}
          onClose={() => (store.modals.isMintModalOpen = false)}
          onSuccess={() => {
            store.modals.isMintMemeModalOpen = true;
          }}
          goToPixels={() => {
            store.modals.isMintModalOpen = false;
            store.modals.isMintMemeModalOpen = false;
            if (store.currentView !== ViewerView.Manage) {
              store.pushNavigation(ViewerView.Manage);
            }
          }}
        />
      )}
      {store.modals.isBurnModalOpen && (
        <BurnPixelsModal
          defaultPixel={store.selectedPupper}
          isOpen={store.modals.isBurnModalOpen}
          onClose={() => (store.modals.isBurnModalOpen = false)}
          onSuccess={burnedPixelIDs => {
            store.modals.isBurnMemeModalOpen = true;
            if (store.selectedPupper) {
              if (burnedPixelIDs.includes(store.selectedPupper)) {
                store.getTokenOwner(store.selectedPupper);
              }
            }
          }}
          onCompleteClose={() => {
            store.modals.isBurnModalOpen = false;
            store.modals.isBurnMemeModalOpen = false;
          }}
        />
      )}
      {store.modals.isScrollModalOpen && (
        <ScrollHelperModal
          isOpen={store.modals.isScrollModalOpen}
          onClose={() => (store.modals.isScrollModalOpen = false)}
        />
      )}
      {store.modals.isMintMemeModalOpen && (
        <MemeModal
          type={"mint"}
          isOpen={store.modals.isMintMemeModalOpen}
          onClose={() => (store.modals.isMintMemeModalOpen = false)}
        />
      )}
      {store.modals.isBurnMemeModalOpen && (
        <MemeModal
          type={"burn"}
          isOpen={store.modals.isBurnMemeModalOpen}
          onClose={() => (store.modals.isBurnMemeModalOpen = false)}
        />
      )}
      {store.isSelectedDrawerOpen && (
        <Drawer isOpen={store.isSelectedDrawerOpen} onClose={() => (store.isSelectedDrawerOpen = false)}>
          <SelectedPixelPane store={store} />
        </Drawer>
      )}
    </>
  );
});

export default ReloadViewerPage;

import React, {Suspense, useCallback, useEffect, useMemo} from "react";
import {Box, Flex, Grid, GridItem} from "@chakra-ui/react";
import ThreeScene from "./ThreeScene";
import ViewerStore, {ViewerView} from "./Viewer.store";
import {observer} from "mobx-react-lite";
import Pane from "../../DSL/Pane/Pane";
import BurnPixelsModal from "./BurnPixelsModal/BurnPixelsModal";
import ManagePane from "./Panes/ManagePane";
import IndexPane from "./Panes/IndexPane";
import MintPixelsModal from "./MintPixelsModal/MintPixelsModal";
import SelectedPixelPane from "./Panes/SelectedPixelPane";
import AppStore from "../../store/App.store";
import Icon from "../../DSL/Icon/Icon";
import Loading from "../../DSL/Loading/Loading";
import ScrollHelperModal from "./ScrollHelperModal/ScrollHelperModal";
import {useQuery} from "../../helpers/hooks";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import MemeModal from "./MemeModal";
import Drawer from "../../DSL/Drawer/Drawer";

export type onPixelSelectType = (x: number, y: number) => void;

const ViewerPage = observer(function ViewerPage() {
  const query = useQuery()
  const x = query.get("x")
  const y = query.get("y")
  const store = useMemo(() => new ViewerStore(x,y), [x, y]);

  useEffect(() => {
    store.init()
    return () => {
      store.destroy()
    }
    // eslint-disable-next-line
  }, [])

  const onPixelSelect: onPixelSelectType = useCallback((x: number, y: number) => {
    store.selectedPupper = AppStore.web3.coordinateToPupperLocal(x, y);
    if (store.currentView !== ViewerView.Selected) {
      store.pushNavigation(ViewerView.Selected)
    }
    if (AppStore.rwd.isMobile) {
      store.isSelectedDrawerOpen = true
    }
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Grid templateColumns={{base: "2fr 2fr", sm: "2fr 1.5fr", lg: "2fr 0.8fr"}} templateRows={"1fr"} flexGrow={1}>
        <GridItem mr={{base: 0, md: 5}} colSpan={{base: 3, md: 1}} zIndex={2}>
          <Pane w={"100%"} h={"100%"} p={0}>
            <Suspense fallback={<Flex
              justifyContent={"center"}
              alignItems={"center"}
              position={"absolute"}
              w={"full"}
              h={"full"}>
              <Loading/>
            </Flex>}>
              <ThreeScene
                onPixelSelect={onPixelSelect}
                store={store}
              />
            </Suspense>
          </Pane>
        </GridItem>
        <GridItem ml={5} colSpan={{base: 0, md: 1}} display={{base: "none", md: "block"}}>
          <Pane
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
            title={store.currentView === ViewerView.Index &&
              <Typography variant={TVariant.PresStart20}>Own the doge</Typography>}>
              {store.showGoBack && <Box position={"relative"} left={"-25px"} top={"-20px"}>
                  <Box
                    p={0}
                    size={"sm"}
                    _hover={{cursor: "pointer"}}
                    _active={{transform: "translate(4px, 4px)"}}
                    onClick={() => {
                      store.popNavigation()
                      store.clearSelectedPupper()
                    }}
                  >
                    <Icon icon={"arrow-left"}/>
                </Box>
              </Box>}
            {store.currentView === ViewerView.Index && <IndexPane store={store}/>}
            {store.currentView === ViewerView.Manage && <ManagePane store={store}/>}
            {store.currentView === ViewerView.Selected && <SelectedPixelPane store={store}/>}
          </Pane>
        </GridItem>
      </Grid>
      {store.modals.isMintModalOpen && <MintPixelsModal
        isOpen={store.modals.isMintModalOpen}
        onClose={() => store.modals.isMintModalOpen = false}
        onSuccess={() => {
          store.modals.isMintMemeModalOpen = true
        }}
        goToPixels={() => {
          store.modals.isMintModalOpen = false
          store.modals.isMintMemeModalOpen = false
          if (store.currentView !== ViewerView.Manage) {
            store.pushNavigation(ViewerView.Manage)
          }
        }}
      />}
      {store.modals.isBurnModalOpen && <BurnPixelsModal
        defaultPixel={store.selectedPupper}
        isOpen={store.modals.isBurnModalOpen}
        onClose={() => store.modals.isBurnModalOpen = false}
        onSuccess={() => {
          store.modals.isBurnMemeModalOpen = true
        }}
        onCompleteClose={() => {
          store.modals.isBurnModalOpen = false
          store.modals.isBurnMemeModalOpen = false
        }}
      />}
      {store.modals.isMintModalOpen && <ScrollHelperModal
        isOpen={store.modals.isHelperModalOpen}
        onClose={() => store.modals.isHelperModalOpen = false}
      />}
      {store.modals.isMintMemeModalOpen && <MemeModal
        type={"mint"}
        isOpen={store.modals.isMintMemeModalOpen}
        onClose={() => store.modals.isMintMemeModalOpen = false}
      />}
      {store.modals.isBurnMemeModalOpen && <MemeModal
        type={"burn"}
        isOpen={store.modals.isBurnMemeModalOpen}
        onClose={() => store.modals.isBurnMemeModalOpen = false}
      />}
      {store.isSelectedDrawerOpen &&
      <Drawer
        isOpen={store.isSelectedDrawerOpen}
        onClose={() => store.isSelectedDrawerOpen = false}
      >
        <SelectedPixelPane store={store}/>
      </Drawer>}
    </>
  );
});

export default ViewerPage;

import React, {Suspense, useCallback, useMemo} from "react";
import {Box, Flex, Grid, GridItem} from "@chakra-ui/react";
import ThreeScene from "./ThreeScene";
import ViewerStore, {ViewerView} from "./Viewer.store";
import {observer} from "mobx-react-lite";
import Pane from "../../DSL/Pane/Pane";
import BurnPixelsModal from "./BurnPixelsModal/BurnPixelsModal";
import ManagePane from "./ManagePane";
import IndexPane from "./IndexPane";
import MintPixelsModal from "./MintPixelsModal/MintPixelsModal";
import SelectedPixelPane from "./SelectedPixelPane";

export type onPixelSelectType = (x: number, y: number, pixelPosition: THREE.Vector3) => void;

const ViewerPage = observer(function ViewerPage() {
  const store = useMemo(() => new ViewerStore(), []);

  const onPixelSelect: onPixelSelectType = useCallback((x: number, y: number, pixelPosition: THREE.Vector3) => {
    store.pixelX = x;
    store.pixelY = y;
    store.selectedPixel = pixelPosition;
    if (store.currentView !== ViewerView.Selected) {
      store.pushNavigation(ViewerView.Selected)
    }
  }, []);

  // const onPixelClear = useCallback(() => {
  //   store.clearPixelPosition();
  //   store.popNavigation()
  // }, []);

  return (
    <>
      <Grid templateColumns={"2fr 1fr"} templateRows={{base: "1fr fr", lg: "1fr"}} flexGrow={1}>
        <GridItem mr={5} colSpan={{base: 2, lg: 1}}>
          <Pane w={"100%"} h={"100%"}>
            <Suspense fallback={"Loading Kobosu..."}>
              <ThreeScene
                onPixelSelect={onPixelSelect}
                selectedPixel={store.selectedPixel}
                // onPixelClear={onPixelClear}
              />
            </Suspense>
          </Pane>
        </GridItem>
        <GridItem ml={5} colSpan={{base: 2, lg: 1}}>
          <Pane p={3} display={"flex"} flexDirection={"column"} justifyContent={"space-between"} h={"100%"}>
            {store.currentView === ViewerView.Index && <IndexPane store={store}/>}
            {store.currentView === ViewerView.Manage && <ManagePane store={store}/>}
            {store.currentView === ViewerView.Selected && <SelectedPixelPane store={store}/>}
          </Pane>
        </GridItem>
      </Grid>
      <MintPixelsModal isOpen={store.isMintModalOpen} onClose={() => store.isMintModalOpen = false}/>
      <BurnPixelsModal isOpen={store.isBurnModalOpen} onClose={() => store.isBurnModalOpen = false}/>
    </>
  );
});

export default ViewerPage;

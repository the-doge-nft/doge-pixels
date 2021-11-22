import React, {Suspense, useCallback, useEffect, useMemo} from "react";
import {Box, Button, Flex, Grid, GridItem, Image} from "@chakra-ui/react";
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
import {showDebugToast} from "../../DSL/Toast/Toast";
import {ButtonVariant} from "../../DSL/Button/Button";
import Icon from "../../DSL/Icon/Icon";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import Modal from "../../DSL/Modal/Modal";
import Loading from "../../DSL/Loading/Loading";
import ScrollHelperModal from "./ScrollHelperModal/ScrollHelperModal";

export type onPixelSelectType = (x: number, y: number) => void;

const ViewerPage = observer(function ViewerPage() {
  const store = useMemo(() => new ViewerStore(), []);

  useEffect(() => {
    store.init()
    return () => {
      store.destroy()
    }
  }, [])

  const onPixelSelect: onPixelSelectType = useCallback((x: number, y: number) => {
    store.selectedPupper = AppStore.web3.coordinateToPupperLocal(x, y);
    if (store.currentView !== ViewerView.Selected) {
      store.pushNavigation(ViewerView.Selected)
    }
  }, []);
  return (
    <>
      <Grid templateColumns={"2fr 1fr"} templateRows={{base: "1fr fr", lg: "1fr"}} flexGrow={1}>
        <GridItem mr={{base: 0, md: 5}} colSpan={{base: 3, md: 1}}>
          <Pane w={"100%"} h={"100%"}>
            <Suspense fallback={<Loading/>}>
              <ThreeScene
                onPixelSelect={onPixelSelect}
                selectedPixel={store.selectedPupper}
                store={store}
              />
            </Suspense>
          </Pane>
        </GridItem>
        <GridItem ml={5} colSpan={{base: 0, md: 1}} display={{base: "none", md: "block"}}>
          <Pane py={10} px={10} position={"relative"} display={"flex"} flexDirection={"column"} justifyContent={"space-between"} h={"100%"}>
              {store.showGoBack && <Box position={"absolute"} left={"7px"} top={"7px"}>
                  <Button
                    p={0}
                    size={"sm"}
                    onClick={() => {
                      store.popNavigation()
                      store.clearSelectedPupper()
                    }}
                    variant={ButtonVariant.Text}
                  >
                    <Icon icon={"arrow-left"} />
                  {/*&#8592;*/}
                </Button>
              </Box>}
            {store.currentView === ViewerView.Index && <IndexPane store={store}/>}
            {store.currentView === ViewerView.Manage && <ManagePane store={store}/>}
            {store.currentView === ViewerView.Selected && <SelectedPixelPane store={store}/>}
          </Pane>
        </GridItem>
      </Grid>
      <MintPixelsModal
        isOpen={store.isMintModalOpen}
        onClose={() => store.isMintModalOpen = false}
      />
      <BurnPixelsModal
        defaultPixel={store.selectedPupper}
        isOpen={store.isBurnModalOpen}
        onClose={() => store.isBurnModalOpen = false}
      />
      <ScrollHelperModal
        isOpen={store.isHelperModalOpen}
        onClose={() => store.isHelperModalOpen = false}
      />
    </>
  );
});

export default ViewerPage;

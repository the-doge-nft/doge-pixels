import React, {Suspense, useCallback, useEffect, useMemo} from "react";
import {Box, Button, Flex, Grid, GridItem} from "@chakra-ui/react";
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
import {ButtonVariant} from "../../DSL/Button/Button";
import Icon from "../../DSL/Icon/Icon";
import Loading from "../../DSL/Loading/Loading";
import ScrollHelperModal from "./ScrollHelperModal/ScrollHelperModal";
import {useQuery} from "../../helpers/hooks";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import Modal from "../../DSL/Modal/Modal";
import MemeModal from "./MemeModal";

export type onPixelSelectType = (x: number, y: number) => void;

const ViewerPage = observer(function ViewerPage() {
  const query = useQuery()
  const store = useMemo(() => new ViewerStore(
    query.get("x"),
    query.get("y")
  ), []);

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
      <Grid templateColumns={"2fr 0.8fr"} templateRows={{base: "1fr fr", lg: "1fr"}} flexGrow={1}>
        <GridItem mr={{base: 0, md: 5}} colSpan={{base: 3, md: 1}}>
          <Pane w={"100%"} h={"100%"} p={0}>
            <Suspense fallback={<Loading/>}>
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
        onSuccess={() => store.isMintMemeModalOpen = true}
        goToPixels={() => {
          store.isMintModalOpen = false
          store.isMintMemeModalOpen = false
          if (store.currentView !== ViewerView.Manage) {
            store.pushNavigation(ViewerView.Manage)
          }
        }}
      />
      <BurnPixelsModal
        defaultPixel={store.selectedPupper}
        isOpen={store.isBurnModalOpen}
        onClose={() => store.isBurnModalOpen = false}
        onSuccess={() => store.isBurnMemeModalOpen = true}
        onCompleteClose={() => {
          store.isBurnModalOpen = false
          store.isBurnMemeModalOpen = false
        }}
      />
      <ScrollHelperModal
        isOpen={store.isHelperModalOpen}
        onClose={() => store.isHelperModalOpen = false}
      />
      <MemeModal
        type={"mint"}
        isOpen={store.isMintMemeModalOpen}
        onClose={() => store.isMintMemeModalOpen = false}
      />
      <MemeModal
        type={"burn"}
        isOpen={store.isBurnMemeModalOpen}
        onClose={() => store.isBurnMemeModalOpen = false}
      />
    </>
  );
});

export default ViewerPage;

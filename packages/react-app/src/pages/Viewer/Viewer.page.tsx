import React, { Suspense, useCallback, useEffect, useMemo } from "react";
import { Box, Flex } from "@chakra-ui/react";
import DogeExplorer from "./DogeExplorer";
import ViewerStore from "./Viewer.store";
import { observer } from "mobx-react-lite";
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
import { useLocation, useParams } from "react-router-dom";
import { NamedRoutes, route, SELECTED_PIXEL_PARAM } from "../../App.routes";
import Modal from "../../DSL/Modal/Modal";
import Modals from "./Modals";

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
      <Modals store={store} />
    </>
  );
});

export default ViewerPage;

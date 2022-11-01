import { Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { Suspense, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { SELECTED_PIXEL_PARAM } from "../../App.routes";
import Loading from "../../DSL/Loading/Loading";
import Pane from "../../DSL/Pane/Pane";
import DogeExplorer from "./DogeExplorer";
import Modals from "./Modals";
import ViewerStore from "./Viewer.store";

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

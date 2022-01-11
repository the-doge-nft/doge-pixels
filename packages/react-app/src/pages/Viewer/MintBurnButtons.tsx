import React from "react";
import ViewerStore, {ViewerView} from "./Viewer.store";
import {Flex} from "@chakra-ui/react";
import AppStore from "../../store/App.store";
import Button, {ButtonVariant} from "../../DSL/Button/Button";
import { observer } from "mobx-react-lite";

export const MintBurnButtons = observer(({store}: {store: ViewerStore}) => {
  return <Flex direction={"column"} alignItems={"center"} flexGrow={0}>
    {AppStore.web3.web3Provider && <Flex mb={6}>
        <Button mr={3} width={"fit-content"} onClick={() => (store.modals.isMintModalOpen = true)}>
            Mint
        </Button>
      {AppStore.web3.puppersOwned.length > 0 &&
        <Button ml={3} width={"fit-content"} onClick={() => (store.modals.isBurnModalOpen = true)}>
            Burn
        </Button>}
    </Flex>}
    {AppStore.web3.puppersOwned.length > 0 && store.currentView !== ViewerView.Manage && <Button
        width={"fit-content"}
        display={"block"}
        variant={ButtonVariant.Text}
        size={"md"}
        onClick={() => store.pushNavigation(ViewerView.Manage)}>
        View my pixels
    </Button>}
  </Flex>
})

export default MintBurnButtons;

import React from "react";
import { Flex } from "@chakra-ui/react";
import AppStore from "../../store/App.store";
import Button  from "../../DSL/Button/Button";
import { observer } from "mobx-react-lite";

export const MintBurnButtons = observer(() => {
  return (
    <Flex direction={"column"} alignItems={"center"} flexGrow={0}>
      {AppStore.web3.web3Provider && (
        <Flex mb={6}>
          <Button mr={3} width={"fit-content"} onClick={() => (AppStore.modals.isMintModalOpen = true)}>
            Mint
          </Button>
          {AppStore.web3.puppersOwned.length > 0 && (
            <Button ml={3} width={"fit-content"} onClick={() => (AppStore.modals.isBurnModalOpen = true)}>
              Burn
            </Button>
          )}
        </Flex>
      )}
    </Flex>
  );
});

export default MintBurnButtons;

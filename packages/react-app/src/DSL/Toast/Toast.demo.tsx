import { VStack } from "@chakra-ui/react";
import React from "react";
import Button from "../Button/Button";
import Demo from "../Demo/Demo";
import { showDebugToast, showErrorToast, showSuccessToast } from "./Toast";

const DemoToast = () => {
  return (
    <Demo title={"Toast"}>
      <VStack spacing={6}>
        <Button onClick={() => showSuccessToast("nice!")}>Success</Button>
        <Button onClick={() => showDebugToast("nice!")}>Debug</Button>
        <Button onClick={() => showErrorToast("nice!")}>Error</Button>
      </VStack>
    </Demo>
  );
};

export default DemoToast;

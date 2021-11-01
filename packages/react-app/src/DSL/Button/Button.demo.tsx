import React from "react";
import Button, { ButtonVariant } from "./Button";
import Demo from "../Demo/Demo";
import { VStack } from "@chakra-ui/react";

function DemoButton() {
  return (
    <Demo title={"Button"}>
      <VStack>
        <Button>Primary</Button>
        <Button variant={ButtonVariant.Text}>Gray</Button>
      </VStack>
    </Demo>
  );
}

export default DemoButton;

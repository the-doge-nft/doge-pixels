import React from "react";
import Button, { ButtonVariant } from "./Button";
import Demo from "../Demo/Demo";
import { Flex, HStack, VStack } from "@chakra-ui/react";
import { SubDemo } from "../Form/Form.demo";

function DemoButton() {
  return (
    <Demo title={"Button"}>
      <HStack>
        <SubDemo title={"Primary"}>
          <VStack spacing={2}>
            <Button size={"xs"}>xs</Button>
            <Button size={"sm"}>sm</Button>
            <Button size={"md"}>md</Button>
          </VStack>
        </SubDemo>
        <SubDemo title={"Text"}>
          <VStack spacing={2}>
            <Button variant={ButtonVariant.Text} size={"xs"}>
              xs
            </Button>
            <Button variant={ButtonVariant.Text} size={"sm"}>
              sm
            </Button>
            <Button variant={ButtonVariant.Text} size={"md"}>
              md
            </Button>
          </VStack>
        </SubDemo>
      </HStack>
    </Demo>
  );
}

export default DemoButton;

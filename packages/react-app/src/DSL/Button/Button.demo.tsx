import React, { useMemo } from "react";
import Button, { ButtonVariant } from "./Button";
import Demo from "../Demo/Demo";
import { Box, Flex, HStack, VStack } from "@chakra-ui/react";
import { SubDemo } from "../Form/Form.demo";
import { observer } from "mobx-react-lite";

const DemoButton = observer(() => {
  return (
    <Demo title={"Button"}>
      <HStack>
        <SubDemo title={"Primary"}>
          <VStack spacing={2}>
            <Button size={"sm"}>sm</Button>
          </VStack>
        </SubDemo>
        <SubDemo title={"Text"}>
          <VStack spacing={2}>
            <Button variant={ButtonVariant.Text} size={"sm"}>
              sm
            </Button>
          </VStack>
        </SubDemo>
      </HStack>
    </Demo>
  );
});

export default DemoButton;

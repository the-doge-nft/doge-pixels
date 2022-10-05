import { Box, Flex, HStack } from "@chakra-ui/react";
import React from "react";
import Demo from "../Demo/Demo";
import PixelPane from "./PixelPane";

const PixelPaneDemo = () => {
  return (
    <Demo title="Pixel Pane">
      <Flex flexDirection={"column"} alignItems={"center"}>
        <Box>
          <HStack>
            <PixelPane onClick={pupper => alert(`you hit pupper: ${pupper}`)} size={"sm"} pupper={1065551} />
            <PixelPane isNew variant={"shadow"} size={"sm"} pupper={1065551} />
          </HStack>
        </Box>
        <Box mt={8}>
          <HStack>
            <PixelPane pupper={1065551} />
            <PixelPane variant={"shadow"} onClick={pupper => alert(`you hit pupper: ${pupper}`)} pupper={1065551} />
          </HStack>
        </Box>
        <Box mt={8}>
          <HStack>
            <PixelPane onClick={pupper => alert(`you hit pupper: ${pupper}`)} size={"lg"} pupper={1065551} />
            <PixelPane variant={"shadow"} size={"lg"} pupper={1065551} />
          </HStack>
        </Box>
      </Flex>
    </Demo>
  );
};

export default PixelPaneDemo;

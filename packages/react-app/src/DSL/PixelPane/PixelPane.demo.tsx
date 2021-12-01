import { Box, Flex, HStack } from "@chakra-ui/react";
import React from "react";
import Demo from "../Demo/Demo";
import PixelPane from "./PixelPane";

const PixelPaneDemo = () => {
    return <Demo title="Pixel Pane">
        <Flex flexDirection={"column"} alignItems={"center"}>
            <Box>
                <HStack>
                    <PixelPane
                      pupper={10}
                      color={"#b6b76b"}
                      pupperIndex={342}
                    />
                    <PixelPane
                      variant={"shadow"}
                      onClick={(pupper) => alert(`you hit pupper: ${pupper}`)}
                      pupper={10} color={"#d79d75"}
                      pupperIndex={938}
                    />
                </HStack>
            </Box>
            <Box mt={8}>
                <HStack>
                    <PixelPane
                      onClick={(pupper) => alert(`you hit pupper: ${pupper}`)}
                      size={"lg"}
                      pupper={10}
                      color={"#c5b68b"}
                      pupperIndex={234}
                    />
                    <PixelPane
                      variant={"shadow"}
                      size={"lg"}
                      pupper={10}
                      color={"#e7ca6e"}
                      pupperIndex={543}
                    />
                </HStack>
            </Box>
        </Flex>
    </Demo>
}

export default PixelPaneDemo
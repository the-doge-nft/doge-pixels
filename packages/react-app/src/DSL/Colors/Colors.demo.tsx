import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import Demo from "../Demo/Demo";
import Colors from "./Colors";
import Typography, { TVariant } from "../Typography/Typography";

const ColorBox = ({ name, hex }: { name: string; hex: string }) => {
  return (
    <Flex direction={"column"} m={3}>
      <Typography variant={TVariant.ComicSans14} mb={2} color={"gray.400"}>
        {name}
      </Typography>
      <Box position={"relative"}>
        <Typography
          variant={TVariant.ComicSans12}
          color={"gray.400"}
          position={"absolute"}
          left={"50%"}
          top={"50%"}
          transform={"translate(-50%, -50%)"}
        >
          ({hex})
        </Typography>
        <Box bg={name} w={20} h={20} />
      </Box>
    </Flex>
  );
};

const DemoColors = () => {
  return (
    <Demo title={"Colors"}>
      <Flex wrap={"wrap"}>
        {Object.keys(Colors).map(color => {
          if (typeof Colors[color] === "string") {
            return <ColorBox name={color} hex={Colors[color] as string} />;
          } else if (typeof Colors[color] === "object") {
            return Object.keys(Colors[color]).map(hue => (
              <ColorBox
                name={`${color}.${hue}`}
                //@ts-ignore
                hex={Colors[color][hue] as string}
              />
            ));
          } else return <></>;
        })}
      </Flex>
    </Demo>
  );
};

export default DemoColors;

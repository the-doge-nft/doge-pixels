import React from "react";
import { Box, Circle, Flex } from "@chakra-ui/react";
import Typography, { TVariant } from "../Typography/Typography";

interface Stepper {
  items: { title: string; key: string }[];
  activeIndex: number;
}

const CircleLineProgress = ({ items, activeIndex }: Stepper) => {
  const valueNow = (100 / (items.length - 1)) * activeIndex;
  return (
    <Box position={"relative"} mb={5} mx={5}>
      <Flex w={"100%"} alignItems={"center"} justifyContent={"space-between"}>
        {items.map((item, index, arr) => (
          <ProgressCircle key={item.key} title={item.title} isActive={activeIndex >= index} />
        ))}
      </Flex>
      <Box
        h={"2px"}
        bg={"gray.50"}
        w={"100%"}
        position={"absolute"}
        top={"50%"}
        transform={"translateY(-50%)"}
        role={"progressbar"}
        // ariaValueMin={0}
        // ariaValueMax={100}
        // ariaValueNow={valueNow}
        // arivaValueText={`Progress: ${valueNow}`}
      >
        <Box h={"inherit"} bg={"blue.400"} w={`${valueNow}%`} />
      </Box>
    </Box>
  );
};

const ProgressCircle = ({ title, isActive }: { title: string; isActive: boolean }) => {
  return (
    <Flex direction={"column"} alignItems={"center"} position={"relative"} zIndex={2}>
      <Circle size={"8px"} bg={isActive ? "blue.500" : "gray.400"} />
      <Typography
        variant={isActive ? TVariant.ComicSans12 : TVariant.PresStart12}
        color={isActive ? "blue.500" : "gray.400"}
        position={"absolute"}
        top={"15px"}
      >
        {title}
      </Typography>
    </Flex>
  );
};

export default CircleLineProgress;

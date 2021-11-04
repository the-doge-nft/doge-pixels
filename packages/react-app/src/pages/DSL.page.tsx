import React from "react";
import SliderDemo from "../DSL/Slider/Slider.demo";
import { Box } from "@chakra-ui/react";
import Typography, { TVariant } from "../DSL/Typography/Typography";
import TabsDemo from "../DSL/Tabs/Tabs.demo";

const DSLPage = () => {
  return (
    <Box px={100}>
      <Box textAlign={"center"}>
        <Typography variant={TVariant.Title28} block mb={7}>
          ✨ DSL ✨
        </Typography>
      </Box>
      <SliderDemo />
        <TabsDemo />
    </Box>
  );
};

export default DSLPage;

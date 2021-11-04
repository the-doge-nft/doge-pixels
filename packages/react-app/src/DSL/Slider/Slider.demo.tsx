import { Box } from "@chakra-ui/react";
import React from "react";
import Demo from "../Demo/Demo";
import { SubDemo } from "../Form/Form.demo";
import Slider from "./Slider";

const SliderDemo = () => {
  return (
    <Box>
      <Demo title={"Slider"}>
        <SubDemo title={"Discrete Slider"}>
          <Slider defaultValue={10} step={10} min={0} max={40} />
        </SubDemo>
        <SubDemo title={"Continuous Slider"}>
          <Slider min={0} max={400} />
        </SubDemo>
      </Demo>
    </Box>
  );
};

export default SliderDemo;

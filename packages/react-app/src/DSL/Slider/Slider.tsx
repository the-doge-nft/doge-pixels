import {
  Slider as ChakraUISlider,
  SliderTrack,
  SliderProps as ChakraUISliderProps,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import React from "react";

interface SliderProps extends ChakraUISliderProps {}

const Slider = (props: SliderProps) => {
  return (
    <ChakraUISlider {...props}>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </ChakraUISlider>
  );
};

export default Slider;

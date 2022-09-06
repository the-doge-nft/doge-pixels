import React from "react";
import { IconProps as ChakraIconProps } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";

const Close = ({ ...rest }: ChakraIconProps) => {
  return (
    <Icon viewBox={"0 0 20 19"} {...rest}>
      <line x1="1.35355" y1="1.15768" x2="18.6869" y2="18.491" stroke="currentColor" />
      <line
        y1="-0.5"
        x2="24.513"
        y2="-0.5"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 19 1.51123)"
        stroke="currentColor"
      />
    </Icon>
  );
};

export default Close;

import React from "react";
import { IconProps as ChakraIconProps } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";

const Back = ({ ...rest }: ChakraIconProps) => {
  return (
    <Icon viewBox={"0 0 19 17"} fill={"none"} {...rest}>
      {/*<svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
      <line x1="1.19946" y1="8.5" x2="18.5711" y2="8.5" stroke="currentColor" />
      <path d="M8.55511 16.0942L1 8.48913L8.55511 0.999883" stroke="currentColor" />
      {/*</svg>*/}
    </Icon>
  );
};

export default Back;

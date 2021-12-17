import React from "react";
import {IconProps as ChakraIconProps} from "@chakra-ui/icon/dist/types/icon";
import {Icon} from "@chakra-ui/react";

const Close = ({...rest}: ChakraIconProps) => {
  return <Icon viewBox={"0 0 20 19"} {...rest}>
    {/*<svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
      <line x1="1.35355" y1="1.15768" x2="18.6869" y2="18.491" stroke="currentColor"/>
      <line y1="-0.5" x2="24.513" y2="-0.5" transform="matrix(-0.707107 0.707107 0.707107 0.707107 19 1.51123)" stroke="currentColor"/>
    {/*</svg>*/}
  </Icon>
}

export default Close

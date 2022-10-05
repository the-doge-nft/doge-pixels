import { IconProps as ChakraIconProps } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";

const ToolPen = ({ ...rest }: ChakraIconProps) => {
  return (
    <Icon {...rest} px={0.5}>
      {/*<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">*/}
      <path d="M 1.993 18 L 3.986 18 L 3.986 16 L 5.979 16 L 5.979 14 L 7.972 14 L 7.972 12 L 9.965 12 L 9.965 10 L 11.958 10 L 11.958 8 L 13.951 8 L 13.951 6 L 15.944 6 L 15.944 4 L 17.937 4 L 17.937 6 L 19.93 6 L 19.93 8 L 17.937 8 L 17.937 10 L 15.944 10 L 15.944 12 L 13.951 12 L 13.951 14 L 11.958 14 L 11.958 16 L 9.965 16 L 9.965 18 L 7.972 18 L 7.972 20 L 5.979 20 L 5.979 22 L 1.993 22 Z M 17.937 2 L 19.93 2 L 19.93 4 L 17.937 4 Z M 19.93 4 L 21.923 4 L 21.923 6 L 19.93 6 Z" />
      {/*</svg>*/}
    </Icon>
  );
};

export default ToolPen;

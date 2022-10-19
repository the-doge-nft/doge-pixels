import { IconProps as ChakraIconProps } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";

const ToolStickers = ({ ...rest }: ChakraIconProps) => {
  return (
    <Icon {...rest} paddingRight={1} pb={0.5}>
      {/*<svg viewBox="1.993 1.998 24 24" xmlns="http://www.w3.org/2000/svg">*/}
      <path d="M 24.007 21.974 L 4.017 21.974 L 4.017 6.006 L 24.007 6.006 Z M 6.016 8.002 L 6.016 19.978 L 22.008 19.978 L 22.008 8.002 Z M 8.015 9.998 L 12.013 9.998 L 12.013 11.994 L 8.015 11.994 Z M 16.011 9.998 L 20.009 9.998 L 20.009 11.994 L 16.011 11.994 Z M 10.014 15.986 L 18.01 15.986 L 18.01 17.982 L 10.014 17.982 Z" />
      {/*</svg>*/}
    </Icon>
  );
};

export default ToolStickers;

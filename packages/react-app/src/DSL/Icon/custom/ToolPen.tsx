import { IconProps as ChakraIconProps } from "@chakra-ui/icon/dist/types/icon";
import { Icon } from "@chakra-ui/react";

const ToolPen = ({ ...rest }: ChakraIconProps) => {
  return <Icon {...rest} paddingLeft={1}>
    {/*<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
      <path d="M0 15.25V19H3.75L14.81 7.94L11.06 4.19L0 15.25ZM17.71 5.04C18.1 4.65 18.1 4.02 17.71 3.63L15.37 1.29C14.98 0.899998 14.35 0.899998 13.96 1.29L12.13 3.12L15.88 6.87L17.71 5.04V5.04Z" fill="#323232" />
    {/*</svg>*/}
  </Icon>
}

export default ToolPen

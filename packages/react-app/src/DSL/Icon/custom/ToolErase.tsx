import { IconProps as ChakraIconProps } from "@chakra-ui/icon/dist/types/icon";
import { Icon } from "@chakra-ui/react";

const ToolErase = ({ ...rest }: ChakraIconProps) => {
    return <Icon {...rest}>
        {/*<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-eraser" width="24" height="24" viewBox="0 0 24 24">*/}
        <path d="M16.24,3.56L21.19,8.5C21.97,9.29 21.97,10.55 21.19,11.34L12,20.53C10.44,22.09 7.91,22.09 6.34,20.53L2.81,17C2.03,16.21 2.03,14.95 2.81,14.16L13.41,3.56C14.2,2.78 15.46,2.78 16.24,3.56M4.22,15.58L7.76,19.11C8.54,19.9 9.8,19.9 10.59,19.11L14.12,15.58L9.17,10.63L4.22,15.58Z" />
        {/*</svg>*/}
    </Icon>
}

export default ToolErase
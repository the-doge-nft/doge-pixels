import { IconProps as ChakraIconProps } from "@chakra-ui/icon/dist/types/icon";
import { Icon } from "@chakra-ui/react";

const ToolStickers = ({ ...rest }: ChakraIconProps) => {
    return <Icon {...rest}>
        {/*<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">*/}
        <path d="M0 0h24v24H0z" fill="none"/><path d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"/>
        {/*</svg>*/}
    </Icon>
}

export default ToolStickers
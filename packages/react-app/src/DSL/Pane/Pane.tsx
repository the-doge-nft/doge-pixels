import {Box, useStyleConfig} from "@chakra-ui/react"
import React from "react"
import {AllowedStyleProps} from "../Form/interfaces";

interface PaneProps extends AllowedStyleProps {
    children?: any;
}

const Pane = ({children, ...rest}: PaneProps) => {
    const styles = useStyleConfig("Pane");
    return <Box __css={styles} {...rest}>
        {children && children}
    </Box>
}

export default Pane;

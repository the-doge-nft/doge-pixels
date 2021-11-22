import { Box, Flex, useStyleConfig } from "@chakra-ui/react";
import React from "react";
import Typography, { TVariant } from "../Typography/Typography";
import "./Loading.css";


const Loading = () => {
    const styles = useStyleConfig('Loading')
    return <Flex flexDirection={"column"} alignItems={"center"}>
        <Box>
            <Typography variant={TVariant.PresStart18} mb={2} block>Loading</Typography>
        </Box>
        <Box __css={styles}>
            {Array.from(Array(15).keys()).map((key, index) => <Box
                mr={2}
                display={"inline-block"}
                height={"100%"} 
                bg={"black"}
                w={"20px"}
                flexShrink={0}
            />)}
        </Box>
    </Flex>
}

export default Loading;

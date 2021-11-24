import {Box, Flex, useMultiStyleConfig, useStyleConfig} from "@chakra-ui/react";
import React from "react";
import Typography, {TVariant} from "../Typography/Typography";
import "./Loading.css";


const Loading = ({title}: { title?: string }) => {
  const styles = useMultiStyleConfig('Loading', {})
  return <Flex flexDirection={"column"} alignItems={"center"}>
    <Box>
      <Typography
        variant={TVariant.PresStart20}
        mb={4}
        block
      >
        {title ? title : "Loading..."}
      </Typography>
    </Box>
    <Box __css={styles.container}>
      <Box className={"loader"}>
        {Array.from(Array(10).keys()).map((key, index) => <Box
          __css={styles.pixel}
        />)}
      </Box>
    </Box>
  </Flex>
}

export default Loading;

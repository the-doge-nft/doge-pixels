import {Box, Flex, useMultiStyleConfig} from "@chakra-ui/react";
import React from "react";
import Typography, {TVariant} from "../Typography/Typography";
import "./Loading.css";


const Loading = ({title, showSigningHint = false}: { title?: string, showSigningHint?: boolean }) => {
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
    {showSigningHint && <Typography
      variant={TVariant.PresStart10}
      mt={6}
      block
    >
      {"(sign the tx in your wallet to continue️)"}
    </Typography>}
  </Flex>
}

export default Loading;

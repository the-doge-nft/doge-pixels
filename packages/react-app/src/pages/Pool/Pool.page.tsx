import {Box, Flex} from "@chakra-ui/react";
import React from "react";
import Typography, {TVariant} from "../../DSL/Typography/Typography";

const PoolPage = () => {
  return <Flex h={"full"} justifyContent={"center"} alignItems={"center"}>
    <Typography variant={TVariant.PresStart45} color={"yellow.700"}>
      @COLDPLUNGE & @NEMOCHIPS COLLAB
    </Typography>
  </Flex>;
};

export default PoolPage;

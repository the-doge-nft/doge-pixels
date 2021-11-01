import React, { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

const UITools = () => {
  const ref = useRef(null);
  useEffect(() => {}, []);
  return (
    <Box ref={ref} id={"uitools"} w={"50px"} h={"100px"} position={"absolute"} border={"2px solid black"}>
      <Box></Box>
    </Box>
  );
};

export default UITools;

import React from "react";
import { Box } from "@chakra-ui/react";
import Typography, { TVariant } from "../DSL/Typography/Typography";
import DemoButton from "../DSL/Button/Button.demo";
import DemoModal from "../DSL/Modal/Modal.demo";
import DemoColors from "../DSL/Colors/Colors.demo";

const DSLPage = () => {
  return (
    <Box px={250}>
      <Box textAlign={"center"}>
        <Typography variant={TVariant.Title28} block mb={7}>
          ✨ DSL ✨
        </Typography>
        <DemoButton />
        <DemoModal />
        <DemoColors />
      </Box>
    </Box>
  );
};

export default DSLPage;

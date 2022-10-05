import { Box } from "@chakra-ui/react";
import React from "react";
import Demo from "../Demo/Demo";
import Loading from "./Loading";

const DemoLoading = () => {
  return (
    <Demo title="Loading">
      <Box mb={14}>
        <Loading />
      </Box>
      <Loading title={"Waiting 4 👆..."} showSigningHint />
    </Demo>
  );
};

export default DemoLoading;

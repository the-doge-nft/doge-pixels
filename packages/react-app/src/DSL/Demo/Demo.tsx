import React from "react";
import { Box, useColorMode, useStyleConfig } from "@chakra-ui/react";
import Typography, { TVariant } from "../Typography/Typography";

interface DemoProps extends React.Props<any> {
  title: string;
}

const Demo = ({ title, children }: DemoProps) => {
  const styles = useStyleConfig("Demo");
  return (
    <Box w={"100%"} border={"2px solid"} borderColor={"gray.100"} borderRadius={5} p={5} mb={5} __css={styles}>
      <Typography block mb={3} color={"gray.400"} variant={TVariant.Body20} textAlign={"left"}>
        {title}
      </Typography>
      {children}
    </Box>
  );
};

export default Demo;

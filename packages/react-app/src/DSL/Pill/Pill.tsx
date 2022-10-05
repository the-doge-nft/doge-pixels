import { Box, useStyleConfig } from "@chakra-ui/react";
import React from "react";
import Typography, { TVariant } from "../Typography/Typography";

interface PillProps {
  size?: "sm";
  children: any;
}

const Pill = ({ size = "sm", children }: PillProps) => {
  const styles = useStyleConfig("Pill", { size });
  return (
    <Box __css={styles}>
      <Typography variant={TVariant.PresStart10}>{children}</Typography>
    </Box>
  );
};

export default Pill;

import React from "react";
import { Box, Flex, useColorMode, useMultiStyleConfig } from "@chakra-ui/react";
import Typography, { TVariant } from "../Typography/Typography";
import { darkModeGradient } from "../Theme";

interface BigTextProps {
  children: string | number;
  label?: string | number;
  size?: "xs" | "sm" | "md" | "lg";
  isLight?: boolean;
}

const sizeToTypeMap = {
  xs: TVariant.PresStart20,
  sm: TVariant.PresStart26,
  md: TVariant.PresStart45,
  lg: TVariant.PresStart65,
};

const BigText = ({ children, label, size = "sm", isLight = false }: BigTextProps) => {
  const styles = useMultiStyleConfig("BigText", { size });
  const { colorMode } = useColorMode();
  let color = "yellow.50";
  if (isLight) {
    if (colorMode === "light") {
      color = "yellow.50";
    } else if (colorMode === "dark") {
      color = "white";
    }
  } else {
    if (colorMode === "light") {
      color = "yellow.700";
    } else {
      color = darkModeGradient;
    }
  }
  return (
    <Flex alignItems={"baseline"} justifyContent={"flex-start"} w={"100%"}>
      <Box position={"relative"} zIndex={1} w={"100%"}>
        <Typography variant={sizeToTypeMap[size]} sx={{ ...styles.main, bg: color }} block>
          {children}
        </Typography>
        <Typography sx={styles.drop} variant={sizeToTypeMap[size]} block>
          {children}
        </Typography>
      </Box>

      {label && (
        <Box position={"relative"} zIndex={1} ml={4} w={"100%"}>
          <Typography variant={sizeToTypeMap[size]} sx={styles.label} block>
            {label}
          </Typography>
          <Typography sx={styles.drop} variant={sizeToTypeMap[size]} block>
            {label}
          </Typography>
        </Box>
      )}
    </Flex>
  );
};

export default BigText;

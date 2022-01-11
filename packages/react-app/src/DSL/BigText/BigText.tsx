import React from "react";
import {Box, Flex, useMultiStyleConfig} from "@chakra-ui/react";
import Typography, {TVariant} from "../Typography/Typography";

interface BigTextProps {
  children: string | number;
  label?: string | number;
  size?: "sm" | "md"
}


const sizeToTypeMap = {
  sm: TVariant.PresStart28,
  md: TVariant.PresStart45
}


const BigText = ({children, label, size = "sm"}: BigTextProps) => {
  const styles = useMultiStyleConfig("BigText", {size})
  return <Flex alignItems={"baseline"} justifyContent={"flex-start"} w={"100%"}>
    <Box position={"relative"} zIndex={1} w={"100%"}>
      <Typography
        variant={sizeToTypeMap[size]}
        sx={styles.main}
        block
      >
        {children}
      </Typography>
      <Typography
        sx={styles.drop}
        variant={sizeToTypeMap[size]}
        block
      >
        {children}
      </Typography>
    </Box>

    {label && <Box position={"relative"} zIndex={1} ml={8} w={"100%"}>
      <Typography
        variant={sizeToTypeMap[size]}
        sx={styles.label}
        block
      >
      {label}
    </Typography>
    <Typography
        sx={styles.drop}
        variant={sizeToTypeMap[size]}
        block
    >
      {label}
    </Typography>
    </Box>}
  </Flex>
}

export default BigText

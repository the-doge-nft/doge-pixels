import React from "react";
import {Box, Flex, useMultiStyleConfig} from "@chakra-ui/react";
import Typography, {TVariant} from "../Typography/Typography";

interface BigTextProps {
  children: string | number;
  label?: string | number;
  size?: "sm" | "md" | "lg";
  isLight?: boolean
}


const sizeToTypeMap = {
  sm: TVariant.PresStart28,
  md: TVariant.PresStart45,
  lg: TVariant.PresStart65
}


const BigText = ({children, label, size = "sm", isLight = false}: BigTextProps) => {
  const styles = useMultiStyleConfig("BigText", {size})
  return <Flex alignItems={"baseline"} justifyContent={"flex-start"} w={"100%"}>
    <Box position={"relative"} zIndex={1} w={"100%"}>
      <Typography
        variant={sizeToTypeMap[size]}
        sx={{...styles.main, bg: isLight ? 'yellow.50' : 'yellow.700'}}
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

    {label && <Box position={"relative"} zIndex={1} ml={4} w={"100%"}>
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

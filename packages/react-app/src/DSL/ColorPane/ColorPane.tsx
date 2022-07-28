import { Box, useMultiStyleConfig } from "@chakra-ui/react";
import React from "react";
import Typography, { TVariant } from "../Typography/Typography";
import Pill from "../Pill/Pill";

interface ColorPaneProps {
    color: string;
    onClick?: (color: string) => void;
    variant?: "solid" | "shadow";
}

const ColorPane = ({ color, onClick, variant = "solid"}: ColorPaneProps) => {
    const styles = useMultiStyleConfig("ColorPane", {variant: variant})
    return <Box
          __css={styles.container}
          _hover={onClick ? {
              cursor: "pointer",
          } : {}}
          onClick={() => onClick && onClick(color)}
          zIndex={1}
        >
            <Box
              __css={styles.swatch}
              bg={color}
            />
    </Box>
}

export default ColorPane;

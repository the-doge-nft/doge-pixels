import { Box, Flex, useMultiStyleConfig } from "@chakra-ui/react";
import React from "react";
import Typography, { TVariant } from "../Typography/Typography";

interface PixelPaneProps {
    pupper: number;
    color: string;
    pupperIndex: number;
    onClick?: (pupper: number) => void;
    variant?: "solid" | "shadow";
    size?: "sm" | "md" | "lg";
}

const sizeToTypeMap = {
    sm: TVariant.PresStart10,
    md: TVariant.PresStart10,
    lg: TVariant.PresStart16
}

const PixelPane = ({pupper, color, onClick, pupperIndex, variant = "solid", size = "md"}: PixelPaneProps) => {
    const styles = useMultiStyleConfig("PixelPane", {size: size, variant: variant})
    return <Box
        __css={styles.container}
        _hover={onClick ? {
            cursor: "pointer",
        } : {}}
        onClick={() => onClick && onClick(pupper)}
    >
        <Box
            __css={styles.swatch}
            bg={color}
        />
        <Box __css={styles.textContainer}>
            <Typography variant={sizeToTypeMap[size]}>
                # {pupperIndex}
            </Typography>
        </Box>
    </Box>
}

export default PixelPane;

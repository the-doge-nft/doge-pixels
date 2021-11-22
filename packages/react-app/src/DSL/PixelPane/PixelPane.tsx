import { Box, Flex, useMultiStyleConfig } from "@chakra-ui/react";
import React from "react";
import Typography, { TVariant } from "../Typography/Typography";

interface PixelPaneProps {
    size?: "sm" | "md" | "lg"
    pupper: number;
    color: string;
    pupperIndex: number;
    onClick?: () => void;
}

const sizeToTypeMap = {
    sm: TVariant.PresStart10,
    md: TVariant.PresStart10,
    lg: TVariant.PresStart16
}

const PixelPane = ({size = "md", pupper, color, onClick, pupperIndex}: PixelPaneProps) => {
    const styles = useMultiStyleConfig("PixelPane", {size})
    return <Box
        __css={styles.container}
        boxShadow={onClick ? "" : "10px 10px 0px black"}
        _hover={onClick ? {
            cursor: "pointer",
            // borderColor: "yellow.700"
        } : {}}
        onClick={onClick}
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

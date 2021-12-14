import { Box, Flex, useMultiStyleConfig } from "@chakra-ui/react";
import React from "react";
import Typography, { TVariant } from "../Typography/Typography";
import Pill from "../Pill/Pill";

interface PixelPaneProps {
    pupper: number;
    color: string;
    pupperIndex: number;
    onClick?: (pupper: number) => void;
    variant?: "solid" | "shadow";
    size?: "sm" | "md" | "lg";
    isNew?: boolean;
}

const sizeToTypeMap = {
    sm: TVariant.PresStart10,
    md: TVariant.PresStart10,
    lg: TVariant.PresStart16
}

const PixelPane = ({pupper, color, onClick, pupperIndex, variant = "solid", size = "md", isNew = false}: PixelPaneProps) => {
    const styles = useMultiStyleConfig("PixelPane", {size: size, variant: variant})
    return <Box
          __css={styles.container}
          _hover={onClick ? {
              cursor: "pointer",
          } : {}}
          onClick={() => onClick && onClick(pupper)}
          zIndex={1}
        >
            {isNew && <Box position={"absolute"} top={-2} right={-3}>
                <Pill>New</Pill>
            </Box>}
            <Box
              __css={styles.swatch}
              bg={color}
            />
            <Box __css={styles.textContainer}>
                <Typography variant={sizeToTypeMap[size]}>
                    # {pupperIndex}
                </Typography>
            </Box>
        <Box __css={styles.drop}/>
    </Box>
}

export default PixelPane;

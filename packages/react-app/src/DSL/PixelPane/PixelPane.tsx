import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import Typography, { TVariant } from "../Typography/Typography";

interface PixelPaneProps {
    size?: "sm" | "lg"
    pupper: number;
    color: string;
    pupperIndex: number;
    onClick?: () => void;
}

const PixelPane = ({size = "sm", pupper, color, onClick, pupperIndex}: PixelPaneProps) => {
    return <Flex 
        flexDirection={"column"}
        w={size === "sm" ? "100px" : "180px"}
        h={size === "sm" ? "140px" : "230px"}
        boxShadow={onClick ? "" : "10px 10px 0px black"}
    >
        <Box 
            w={"100%"}
            h={"100%"}
            bg={color}
            border={"1px solid black"}
            _hover={onClick ? {
                cursor: "pointer",
                borderColor: "yellow.700"
            } : {}}
            onClick={onClick}
        />
        <Box 
            py={size === "sm" ? 0 : 1}
            px={size === "sm" ? 1 : 2}
            borderLeft={"1px solid black"}
            borderRight={"1px solid black"}
            borderBottom={"1px solid black"}
        >
            <Typography variant={size === "sm" ? TVariant.PresStart10 : TVariant.PresStart16}>
                # {pupperIndex}
            </Typography>
        </Box>
    </Flex>
}

export default PixelPane;

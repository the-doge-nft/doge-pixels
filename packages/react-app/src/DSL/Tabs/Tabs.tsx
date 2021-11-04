import {Tab as ChakraTab, TabList as ChakraTabList, Tabs as ChakraTabs} from "@chakra-ui/react";
import React from "react";
import Typography, {TVariant} from "../Typography/Typography";

interface TabProps {
    size?: "sm" | "md";
    items: string[];
    onChange?: (index: number) => void;
    index: number
}

const Tabs = ({
                 size = "sm",
                 items,
                 onChange,
                 index = 0
}: TabProps) => {
    return <ChakraTabs onChange={onChange} size={size} index={index}>
        <ChakraTabList>
            {items.map(item => <ChakraTab>
                <Typography variant={TVariant.Body14}>
                    {item}
                </Typography>
            </ChakraTab>)}
        </ChakraTabList>
    </ChakraTabs>
}

export default Tabs;

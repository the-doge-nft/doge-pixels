import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import Tabs from "./Tabs";

const TabsDemo = () => {
    const tabs = ["one", "two", "three"]
    const [activeIndex, setActiveIndex] = useState(0)
    return <Box>
        <Tabs items={tabs} index={activeIndex} onChange={(index) => setActiveIndex(index)}/>
    </Box>
}

export default TabsDemo

import {Box, Select as ChakraSelect, useColorMode, useMultiStyleConfig} from "@chakra-ui/react";
import React from "react";
import Icon from "../Icon/Icon";


interface SelectProps {
    value: any;
    onChange: (value: any) => void;
    items: { id: string; name: string }[]
}

const Select: React.FC<SelectProps> = ({value, onChange, items}) => {
    const { colorMode } = useColorMode()
    const styles = useMultiStyleConfig("Select", {variant: "solid"})
    return <Box position="relative">
        <ChakraSelect icon={<Icon
            icon={"chevron-down"}
            boxSize={7}/>} value={value} onChange={(e) => onChange(e.target.value)} zIndex="1">
            {items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </ChakraSelect>
        <Box
            //@ts-ignore
            __css={styles.drop}
        />
        {/*<Box w="full" h="full" bg={colorMode === "light" ? "black" : "white"} position="absolute" top="8px" left="8px" />*/}
    </Box>
}


export default Select





import {Box, Select as ChakraSelect} from "@chakra-ui/react";
import Icon from "../Icon/Icon";
import React from "react";


interface SelectProps {
    value: any;
    onChange: (value: any) => void;
    items: { id: string; name: string }[]
}

const Select: React.FC<SelectProps> = ({value, onChange, items}) => {
    return <Box position="relative">
        <ChakraSelect icon={<Icon
            icon={"chevron-down"}
            boxSize={7}/>} value={value} onChange={(e) => onChange(e.target.value)} zIndex="1">
            {items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </ChakraSelect>
        <Box w="full" h="full" bg="black" position="absolute" top="8px" left="8px" />
    </Box>
}


export default Select





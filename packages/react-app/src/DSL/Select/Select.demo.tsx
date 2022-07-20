import Demo from "../Demo/Demo";
import Select from "./Select";
import {useState} from "react";
import {Box} from "@chakra-ui/react";

const items = [
    {id: "ETH", name: "ETH"},
    {id: "USDT", name: "USDT"},
    {id: "DOG", name: "DOG"}
]

const SelectDemo = () => {
    const [value, setValue] = useState("ETH")

    return <Demo title="Select">
        <Box display={"flex"} justifyContent={"center"}>
            <Box maxW={"lg"} w={"full"}>
                <Select items={items} value={value} onChange={(val) => setValue(val)} />
            </Box>
        </Box>
    </Demo>
}

export default SelectDemo

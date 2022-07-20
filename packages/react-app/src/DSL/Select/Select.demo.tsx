import Demo from "../Demo/Demo";
import Select from "./Select";
import {useState} from "react";

const items = [
    {id: "ETH", name: "ETH"},
    {id: "USDT", name: "USDT"},
    {id: "DOG", name: "DOG"}
]

const SelectDemo = () => {
    const [value, setValue] = useState("ETH")

    return <Demo title="Select">
        <Select items={items} value={value} onChange={(val) => setValue(val)} />
    </Demo>
}

export default SelectDemo

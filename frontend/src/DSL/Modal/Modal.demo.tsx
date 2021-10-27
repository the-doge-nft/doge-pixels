import React, {useState} from "react";
import Modal from "./Modal";
import {Text} from "@chakra-ui/react";
import Button from "../Button/Button";
import Demo from "../Demo/Demo";

const DemoModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    return <Demo title={"Modal"}>
        <Button onClick={() => setIsOpen(true)}>Click for Modal</Button>
        <Modal
            isOpen={isOpen}
            renderHeader={() => <Text>Header</Text>}
            renderFooter={() => <Text>Footer</Text>}
            onClose={() => setIsOpen(false)}
        >
            <Text>Check out this modal!</Text>
        </Modal>
    </Demo>
}

export default DemoModal

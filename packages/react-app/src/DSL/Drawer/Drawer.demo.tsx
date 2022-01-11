import React from "react"
import Demo from "../Demo/Demo"
import {useDisclosure} from "@chakra-ui/react";
import Drawer from "./Drawer";
import Button from "../Button/Button";

const DrawerDemo = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return <Demo title={"Drawer"}>
    <Button onClick={onOpen}>open</Button>
    <Drawer
      title={"TEST"}
      isOpen={isOpen}
      onClose={onClose}
    >
      test a lot of stuff is here yo
    </Drawer>
  </Demo>
}

export default DrawerDemo

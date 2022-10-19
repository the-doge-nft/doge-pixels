import React from "react";
import Demo from "../Demo/Demo";
import { useDisclosure } from "@chakra-ui/react";
import Drawer from "./Drawer";
import Button from "../Button/Button";
import VibinDoge from "../../images/meme/mint/vibin.gif";
import { Image } from "@chakra-ui/react";

const DrawerDemo = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Demo title={"Drawer"}>
      <Button onClick={onOpen}>open</Button>
      <Drawer title={"Nice Drawer!"} isOpen={isOpen} onClose={onClose}>
        <Image w={"full"} src={VibinDoge} />
      </Drawer>
    </Demo>
  );
};

export default DrawerDemo;

import React, { useState } from "react";
import Modal from "./Modal";
import { Text } from "@chakra-ui/react";
import Button from "../Button/Button";
import Demo from "../Demo/Demo";
import Typography, { TVariant } from "../Typography/Typography";

const DemoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Demo title={"Modal"}>
      <Button size={"md"} onClick={() => setIsOpen(true)}>
        Click for Modal
      </Button>
      <Modal
        isOpen={isOpen}
        renderHeader={() => <Typography variant={TVariant.Title28}>Header</Typography>}
        renderFooter={() => <Typography variant={TVariant.Body20}>Footer</Typography>}
        onClose={() => setIsOpen(false)}
      >
        <Typography variant={TVariant.Body16}>✨✨✨ wow ✨✨✨</Typography>
      </Modal>
    </Demo>
  );
};

export default DemoModal;

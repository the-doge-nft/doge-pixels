import React, { useState } from "react";
import Modal from "./Modal";
import {Box, Text} from "@chakra-ui/react";
import Button from "../Button/Button";
import Demo from "../Demo/Demo";
import Typography, { TVariant } from "../Typography/Typography";

const DemoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Demo title={"Modal"}>
      <Box>
        <Button onClick={() => setIsOpen(true)}>
          Click for Modal
        </Button>
      </Box>
      <Modal
        isOpen={isOpen}
        title={"Header"}
        renderFooter={() => <Typography variant={TVariant.ComicSans20}>Footer</Typography>}
        onClose={() => setIsOpen(false)}
      >
        <Typography variant={TVariant.ComicSans16}>✨✨✨ wow ✨✨✨</Typography>
      </Modal>
    </Demo>
  );
};

export default DemoModal;

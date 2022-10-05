import React, { useState } from "react";
import Modal from "./Modal";
import { Box, Flex } from "@chakra-ui/react";
import Button from "../Button/Button";
import Demo from "../Demo/Demo";
import Typography, { TVariant } from "../Typography/Typography";

const DemoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Demo title={"Modal"}>
      <Box>
        <Button onClick={() => setIsOpen(true)}>Click for Modal</Button>
      </Box>
      <Modal
        isOpen={isOpen}
        title={"Nice Modal!"}
        renderFooter={() => <Typography variant={TVariant.ComicSans20}>Footer</Typography>}
        onClose={() => setIsOpen(false)}
      >
        <Flex justifyContent={"center"} alignItems={"center"} mt={10} mb={4}>
          <Typography variant={TVariant.ComicSans16}>✨✨✨ wow ✨✨✨</Typography>
        </Flex>
      </Modal>
    </Demo>
  );
};

export default DemoModal;

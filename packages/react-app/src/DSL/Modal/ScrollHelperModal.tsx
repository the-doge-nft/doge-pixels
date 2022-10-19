import { Flex, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import Modal from "./Modal";
import Typography, { TVariant } from "../Typography/Typography";
import PupperHandImage from "../../images/pupperpaw.png";

interface ScrollHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScrollHelperModal = ({ isOpen, onClose }: ScrollHelperModalProps) => {
  return (
    <Modal size={"sm"} isOpen={isOpen} onClose={onClose}>
      <Typography mt={8} variant={TVariant.ComicSans18} textAlign={"center"} fontWeight={"bold"} block>
        ✨ Scroll to Zoom ✨
      </Typography>
      <Flex justifyContent={"center"}>
        <motion.div
          style={{
            position: "relative",
            bottom: "-10px",
          }}
          animate={{
            bottom: "40px",
          }}
          transition={{ ease: "linear", duration: 0.8, repeat: Infinity }}
        >
          <Image src={PupperHandImage} width={"150px"} position={"relative"} bottom={"-90px"} />
        </motion.div>
      </Flex>
    </Modal>
  );
};

export default ScrollHelperModal;

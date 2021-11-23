import React from "react";
import {
  Box,
  Flex,
  ModalProps as ChakraModalProps,
  useColorMode,
  useMultiStyleConfig,
} from "@chakra-ui/react";
import Icon from "../Icon/Icon";
import {lightOrDark} from "../Theme";
import Draggable from "react-draggable";
import Typography, {TVariant} from "../Typography/Typography";
import ReactModal from "react-modal";
import "./Modal.css"


export interface ModalProps extends ChakraModalProps {
  isOpen: boolean;
  renderFooter?: () => JSX.Element;
  title?: string;
}

const styleOverrides = {
  overlay: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "none",
    width: "100vw"
  },
  content: {
    bottom: "unset",
    overflow: "visible",
    padding: 0,
    border: "none",
    borderRadius: 0,
    position: "static",
    background: "none",
    pointerEvents: "none",
    display: "flex",
    justifyContent: "center",
    width: "100%"
  }
};

const Modal = ({
        isOpen,
        onClose,
        children,
        size = "md",
        title
}: ModalProps) => {
  const styles = useMultiStyleConfig("Modal", {size: size})
  const {colorMode} = useColorMode()

  // ReactModal.setAppElement('#react-modal-main');
  return (
    <ReactModal
      onRequestClose={onClose}
      isOpen={isOpen}
      //@ts-ignore
      style={styleOverrides}
    >
      <Draggable handle=".handle">
          <Box __css={styles.container}>
            <Flex
              _hover={{
                cursor: "pointer"
              }}
              _active={{
                cursor: "grabbing"
              }}
              className={"handle"}
              justifyContent={"flex-end"}
              borderBottom={"1px solid"}
              borderColor={lightOrDark(colorMode, "black", "white")}>
              <Box
                borderLeft={"1px solid"}
                borderColor={lightOrDark(colorMode, "black", "white")}
              >
                <Box
                  px={1}
                  _hover={{cursor: "pointer"}}
                  _active={{transform: "translate(2px, 2px)"}}
                  color={lightOrDark(colorMode, "black", "white")}
                  onClick={() => onClose()}
                >
                  <Icon icon={"close"} fontSize={"18px"}/>
                </Box>
              </Box>
            </Flex>
            <Box __css={styles.body}>
              {title && <Box __css={styles.title}>
                <Typography variant={TVariant.PresStart18}>
                  {title}
                </Typography>
              </Box>}
              {children}
            </Box>
          </Box>
      </Draggable>
    </ReactModal>
  );
};

export default Modal;

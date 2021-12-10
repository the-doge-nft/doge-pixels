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


export interface ModalProps extends ReactModal.Props {
  onClose: () => void;
  size?: "xs" | "sm" | "md" | "lg",
  renderFooter?: () => JSX.Element;
  title?: string;
  name?: string;
  defaultPosition?: any;
}

let styleOverrides: {overlay: object, content: object} = {
  overlay: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "none",
    width: "100vw",
    "pointer-events": "none"
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
    width: "100%",
  }
};

const Modal = ({
        isOpen,
        onClose,
        children,
        size = "md",
        title,
        name,
         defaultPosition,
        ...rest
}: ModalProps) => {
  const chakraStyles = useMultiStyleConfig("Modal", {size: size})
  const { colorMode } = useColorMode()

  //@TODO CC
  // ReactModal.setAppElement('#react-modal-main');
  return (
    <ReactModal
      onRequestClose={onClose}
      isOpen={isOpen}
      style={styleOverrides}
      {...rest}
    >
      <Draggable handle={".handle"} defaultPosition={defaultPosition}>
          <Box __css={chakraStyles.container}>
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
            <Box __css={chakraStyles.body}>
              {title && <Box __css={chakraStyles.title}>
                <Typography variant={TVariant.PresStart20}>
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

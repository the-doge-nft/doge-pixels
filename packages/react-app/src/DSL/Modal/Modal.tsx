import { Box, Flex, useColorMode, useMultiStyleConfig } from "@chakra-ui/react";
import { useRef } from "react";
import Draggable from "react-draggable";
import ReactModal from "react-modal";
import Icon from "../Icon/Icon";
import { lightOrDarkMode } from "../Theme";
import Typography, { TVariant } from "../Typography/Typography";
import "./Modal.css";

export interface ModalProps extends ReactModal.Props {
  onClose: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  renderFooter?: () => JSX.Element;
  title?: string;
  name?: string;
  defaultPosition?: any;
  description?: string;
}

let styleOverrides: { overlay: object; content: object } = {
  overlay: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "none",
    width: "100vw",
    pointerEvents: "none",
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
  },
};

const Modal = ({
  isOpen,
  onClose,
  children,
  size = "md",
  title,
  name,
  description,
  defaultPosition,
  ...rest
}: ModalProps) => {
  const chakraStyles = useMultiStyleConfig("Modal", { size: size });
  const { colorMode } = useColorMode();
  const nodeRef = useRef(null);

  ReactModal.setAppElement("#root");

  // https://github.com/react-grid-layout/react-draggable/issues/652
  const NotTypeSafeDraggable: any = Draggable;

  return (
    <ReactModal onRequestClose={onClose} isOpen={isOpen} style={styleOverrides} ariaHideApp={false} {...rest}>
      <NotTypeSafeDraggable nodeRef={nodeRef} bounds={"body"} handle={".handle"} defaultPosition={defaultPosition}>
        <Box
          ref={nodeRef}
          position={"relative"}
          overflow={"hidden"}
          zIndex={1}
          width={"100%"}
          maxWidth={chakraStyles.container.maxWidth as string}
        >
          <Box __css={chakraStyles.container}>
            <Flex>
              <Flex
                width={"100%"}
                _hover={{
                  cursor: "pointer",
                }}
                _active={{
                  cursor: "grabbing",
                }}
                className={"handle"}
                justifyContent={"flex-end"}
                borderBottom={"1px solid"}
                borderColor={lightOrDarkMode(colorMode, "black", "white")}
              />
              <Box
                borderLeft={"1px solid"}
                borderBottom={"1px solid"}
                borderColor={lightOrDarkMode(colorMode, "black", "white")}
              >
                <Box
                  p={1}
                  _hover={{ cursor: "pointer" }}
                  color={lightOrDarkMode(colorMode, "black", "white")}
                  onClick={onClose}
                  lineHeight={"normal"}
                >
                  <Icon icon={"close"} boxSize={5} />
                </Box>
              </Box>
            </Flex>
            <Box __css={chakraStyles.body}>
              {title && (
                <Box __css={chakraStyles.title}>
                  <Typography variant={TVariant.PresStart18}>{title}</Typography>
                </Box>
              )}
              {description && (
                <Box __css={chakraStyles.description}>
                  <Typography variant={TVariant.ComicSans16}>{description}</Typography>
                </Box>
              )}
              {children}
            </Box>
          </Box>
        </Box>
      </NotTypeSafeDraggable>
    </ReactModal>
  );
};

export default Modal;

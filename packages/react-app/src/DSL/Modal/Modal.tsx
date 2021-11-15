import React from "react";
import {
  Box,
  Flex,
  Modal as ChakraModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader as ChakraModalHeader,
  ModalOverlay,
  ModalProps as ChakraModalProps,
  useColorMode,
} from "@chakra-ui/react";
import {ModalFooterProps, ModalHeaderProps} from "@chakra-ui/modal/dist/types/modal";
import Button, {ButtonVariant} from "../Button/Button";
import Icon from "../Icon/Icon";
import { lightOrDark } from "../Theme";

const ModalFoot = ({ children }: ModalFooterProps) => {
  return <ModalFooter>{children}</ModalFooter>;
};

const ModalHead = ({ children }: ModalHeaderProps) => {
  return <ChakraModalHeader>{children}</ChakraModalHeader>;
};

export interface ModalProps extends ChakraModalProps {
  isOpen: boolean;
  renderHeader?: () => JSX.Element;
  renderFooter?: () => JSX.Element;
}

const Modal = ({ isOpen, onClose, renderHeader, renderFooter, children, ...rest }: ModalProps) => {
  const { colorMode } = useColorMode()
  return (
      <ChakraModal isOpen={isOpen} onClose={onClose} {...rest}>
        <ModalOverlay />
          <ModalContent color={"black"}>
            <Flex justifyContent={"flex-end"} borderBottom={"1px solid"} borderColor={lightOrDark(colorMode, "black", "white")}>
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
            <ModalHead>{renderHeader && renderHeader()}</ModalHead>
            <ModalBody>{children}</ModalBody>
            <ModalFoot>{renderFooter && renderFooter()}</ModalFoot>
          </ModalContent>
      </ChakraModal>
  );
};


export default Modal;

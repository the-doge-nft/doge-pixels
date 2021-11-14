import React from "react";
import {
  Box,
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader as ChakraModalHeader,
  ModalOverlay,
  ModalProps as ChakraModalProps,
} from "@chakra-ui/react";
import { ModalFooterProps, ModalHeaderProps } from "@chakra-ui/modal/dist/types/modal";
import Typography, { TVariant } from "../Typography/Typography";
import Button, { ButtonVariant } from "../Button/Button";

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
  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} {...rest}>
      <ModalOverlay />
      <ModalContent color={"black"}>
        <ModalHead>{renderHeader && renderHeader()}</ModalHead>
        <ModalCloseButton variant={ButtonVariant.Text} size={"sm"}>x</ModalCloseButton>
        <ModalBody>{children}</ModalBody>

        <ModalFoot>{renderFooter && renderFooter()}</ModalFoot>
      </ModalContent>
    </ChakraModal>
  );
};


export default Modal;

import React from "react"
import {
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import Typography, {TVariant} from "../Typography/Typography";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: any;
  footer?: any;
}

const Drawer = ({isOpen, onClose, title, children, footer}: DrawerProps) => {
  return <ChakraDrawer
    isOpen={isOpen}
    onClose={onClose}
    placement={"bottom"}
    size={"lg"}
  >
    <DrawerOverlay/>
    <DrawerContent maxH={"85vh"} height={"100%"}>
      <DrawerCloseButton />
      {title && <DrawerHeader>
        <Typography
            variant={TVariant.PresStart24}>
          {title}
        </Typography>
      </DrawerHeader>}
      <DrawerBody>{children && children}</DrawerBody>
      <DrawerFooter>{footer && footer}</DrawerFooter>
    </DrawerContent>
  </ChakraDrawer>
}

export default Drawer

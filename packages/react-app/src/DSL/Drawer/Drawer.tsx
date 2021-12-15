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

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: any;
}

const Drawer = ({isOpen, onClose, title, children}: DrawerProps) => {
  return <ChakraDrawer
    isOpen={isOpen}
    onClose={onClose}
    placement={"bottom"}
  >
    <DrawerOverlay/>
    <DrawerContent>
      <DrawerCloseButton />
      {title && <DrawerHeader>
        <Typography variant={TVariant.PresStart12}>
          {title}
        </Typography>
      </DrawerHeader>}
      <DrawerBody>
        {children && children}
      </DrawerBody>
      <DrawerFooter>footer</DrawerFooter>
    </DrawerContent>
  </ChakraDrawer>
}

export default Drawer

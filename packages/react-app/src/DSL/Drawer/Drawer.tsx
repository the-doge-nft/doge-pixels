import React from "react"
import {
  Box,
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react'
import Typography, {TVariant} from "../Typography/Typography";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: any;
  footer?: any;
  description?: string
}

const Drawer = ({isOpen, onClose, title, children, footer, description}: DrawerProps) => {
  return <ChakraDrawer
    isOpen={isOpen}
    onClose={onClose}
    placement={"bottom"}
    size={"lg"}
  >
    <DrawerOverlay/>
    <DrawerContent maxH={"85vh"} height={"100%"}>
      <DrawerCloseButton />
      <DrawerHeader>
        {title && <Box>
          <Typography
            variant={TVariant.PresStart24}>
          {title}
        </Typography>
        </Box>}
        {description && <Box>
            <Typography variant={TVariant.ComicSans18}>{description}</Typography>
        </Box>}
      </DrawerHeader>
      <DrawerBody>
        {children && children}
      </DrawerBody>
      <DrawerFooter>{footer && footer}</DrawerFooter>
    </DrawerContent>
  </ChakraDrawer>
}

export default Drawer

import React from "react";
import {
  Box,
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useColorMode,
} from "@chakra-ui/react";
import Typography, { TVariant } from "../Typography/Typography";
import { lightOrDarkMode } from "../Theme";
import Icon from "../Icon/Icon";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: any;
  footer?: any;
  description?: string;
}

const Drawer = ({ isOpen, onClose, title, children, footer, description }: DrawerProps) => {
  const { colorMode } = useColorMode();
  return (
    <ChakraDrawer isOpen={isOpen} onClose={onClose} placement={"bottom"} size={"lg"}>
      <DrawerOverlay />
      <DrawerContent maxH={"85vh"} height={"100%"}>
        <DrawerHeader>
          <Box
            _hover={{ cursor: "pointer" }}
            _active={{ transform: "translate(2px, 2px)" }}
            color={lightOrDarkMode(colorMode, "black", "white")}
            onClick={onClose}
            position={"absolute"}
            px={2}
            py={1}
            right={0}
            top={0}
          >
            <Icon icon={"close"} fontSize={"18px"} />
          </Box>
          {title && (
            <Box>
              <Typography variant={TVariant.PresStart24}>{title}</Typography>
            </Box>
          )}
          {description && (
            <Box>
              <Typography variant={TVariant.ComicSans16}>{description}</Typography>
            </Box>
          )}
        </DrawerHeader>
        <DrawerBody>{children && children}</DrawerBody>
        <DrawerFooter>{footer && footer}</DrawerFooter>
      </DrawerContent>
    </ChakraDrawer>
  );
};

export default Drawer;

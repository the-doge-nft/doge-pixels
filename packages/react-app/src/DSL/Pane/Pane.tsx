import {Box, useMultiStyleConfig, useStyleConfig} from "@chakra-ui/react";
import React from "react";
import { AllowedStyleProps } from "../Form/interfaces";

interface PaneProps extends AllowedStyleProps {
  title?: any;
  children?: any;
}

const Pane = ({ children, title, ...rest }: PaneProps) => {
  const styles = useMultiStyleConfig("Pane", {});
  return (
    <Box position={"relative"} zIndex={1} w={"100%"} h={"100%"}>
      <Box __css={styles.container} {...rest}>
        {title && <Box __css={styles.title}>
          {title}
        </Box>}
        {children && children}
      </Box>
    </Box>
  );
};

export default Pane;

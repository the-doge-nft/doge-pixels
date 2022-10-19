import React, { PropsWithChildren } from "react";
import {
  Box,
  Tooltip as ChakraTooltip,
  TooltipProps as ChakraTooltipProps,
  useMultiStyleConfig,
} from "@chakra-ui/react";

interface TooltipProps extends ChakraTooltipProps {}

const Tooltip: React.FC<PropsWithChildren<TooltipProps>> = ({ children, ...rest }) => {
  const styles = useMultiStyleConfig("Tooltip", {});
  return (
    <ChakraTooltip {...rest} __css={styles}>
      <Box>{children}</Box>
    </ChakraTooltip>
  );
};

export default Tooltip;

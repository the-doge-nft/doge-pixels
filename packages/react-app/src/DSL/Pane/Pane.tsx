import { Box, useMultiStyleConfig } from "@chakra-ui/react";
import { forwardRef, LegacyRef } from "react";
import { AllowedStyleProps } from "../Form/interfaces";

interface PaneProps extends AllowedStyleProps {
  title?: any;
  children?: any;
  onClick?: () => void;
  size?: "sm" | "lg";
}

const Pane = forwardRef(({ children, title, size = "lg", ...rest }: PaneProps, ref: LegacyRef<HTMLDivElement>) => {
  const styles = useMultiStyleConfig("Pane", { size });
  return (
    <Box ref={ref} position={"relative"} zIndex={0} {...rest}>
      <Box __css={styles.container} cursor={rest.onClick ? "pointer" : "inherit"} {...rest}>
        {title && <Box __css={styles.title}>{title}</Box>}
        {children && children}
      </Box>
    </Box>
  );
});

export default Pane;

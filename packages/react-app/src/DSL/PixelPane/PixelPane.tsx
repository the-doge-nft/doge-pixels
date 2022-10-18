import { Box, useMultiStyleConfig } from "@chakra-ui/react";
import React from "react";
import Typography, { TVariant } from "../Typography/Typography";
import Pill from "../Pill/Pill";
import AppStore from "../../store/App.store";
import { observer } from "mobx-react-lite";

interface PixelPaneProps {
  pupper: number;
  onClick?: (pupper: number) => void;
  variant?: "solid" | "shadow";
  size?: "xxs" | "xs" | "sm" | "md" | "lg";
  isNew?: boolean;
}

const sizeToTypeMap = {
  xxs: TVariant.PresStart7,
  xs: TVariant.PresStart7,
  sm: TVariant.PresStart8,
  md: TVariant.PresStart10,
  lg: TVariant.PresStart14,
};

const PixelPane = observer(({ pupper, onClick, variant = "solid", size = "md", isNew = false }: PixelPaneProps) => {
  const styles = useMultiStyleConfig("PixelPane", { size: size, variant: variant });
  const coordinates = AppStore.web3.pupperToPixelCoordsLocal(pupper);
  const color = AppStore.web3.pupperToHexLocal(pupper);

  if (size === "xxs") {
    return (
      <Box
        __css={styles.swatch}
        _hover={onClick ? { cursor: "pointer" } : {}}
        onClick={() => onClick && onClick(pupper)}
        bg={color}
      />
    );
  }

  return (
    <Box
      __css={styles.container}
      _hover={onClick ? { cursor: "pointer" } : {}}
      onClick={() => onClick && onClick(pupper)}
      zIndex={1}
    >
      {isNew && (
        <Box position={"absolute"} top={-2} right={-3}>
          <Pill>New</Pill>
        </Box>
      )}
      <Box __css={styles.swatch} bg={color} />
      <Box __css={styles.textContainer}>
        <Typography variant={sizeToTypeMap[size]}>{`(${coordinates[0]},${coordinates[1]})`}</Typography>
      </Box>
      <Box __css={styles.drop} />
    </Box>
  );
});

export default PixelPane;

import React, {useEffect, useState} from "react";
import {Box, Button as ChakraButton,  ButtonProps as ChakraButtonProps, useMultiStyleConfig} from "@chakra-ui/react";
import { ThemeTypings } from "@chakra-ui/styled-system/dist/types/theming.types";
import Typography, { TVariant } from "../Typography/Typography";
import {AllowedStyleProps} from "../Form/interfaces";

export enum ButtonVariant {
  Primary = "primary",
  Text = "text",
}

export interface ButtonProps extends AllowedStyleProps {
  submit?: boolean;
  type?: "submit" | "button";
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  children?: any;
  isDisabled?: boolean;
  isLoading?: boolean;
}

type ButtonSize = "sm" | "md"

const buttonTypographyMap: { [key in ButtonSize]: TVariant } = {
  sm: TVariant.PresStart12,
  md: TVariant.PresStart15,
};

const Button = ({ submit, children, variant = ButtonVariant.Primary, size = "md", isDisabled = false, onClick, isLoading=false, ...rest }: ButtonProps) => {
  const styles = useMultiStyleConfig("Button", {size, variant})
  const [isHover, setIsHover] = useState(false)

  return (
    <Box
      position={"relative"}
      display={"inline-block"}
      zIndex={1}
      __css={styles.container}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      {...rest}
    >
      <ChakraButton
        isDisabled={isDisabled}
        type={submit ? "submit" : "button"}
        variant={variant}
        size={size}
        __css={styles.button}
        onClick={onClick}
        isLoading={isLoading}
      >
        <Typography
          variant={buttonTypographyMap[size]}
          color={"inherit"}
          overflow={"hidden"}
          textOverflow={"ellipsis"}
        >
          {children}
        </Typography>
      </ChakraButton>
      <Box
        //@ts-ignore
        sx={isHover ? {borderImageSource: styles.button["_hover"].borderImageSource} : {}}
        __css={styles.drop}
      />
    </Box>
  );
};

export default Button;

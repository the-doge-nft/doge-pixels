import React from "react";
import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from "@chakra-ui/react";
import { ThemeTypings } from "@chakra-ui/styled-system/dist/types/theming.types";
import Typography, { TVariant } from "../Typography/Typography";

export enum ButtonVariant {
  Primary = "primary",
  Text = "text",
}

export interface ButtonProps extends ChakraButtonProps {
  submit?: boolean;
  type?: "submit" | "button";
  variant?: ButtonVariant;
  size?: ButtonSize;
}

type ButtonSize = "sm" | "md"

const buttonTypographyMap: { [key in ButtonSize]: TVariant } = {
  sm: TVariant.PresStart12,
  md: TVariant.PresStart15,
  // lg: TVariant.Body20,
};

const Button = ({ submit, children, variant = ButtonVariant.Primary, size = "md", isDisabled, ...rest }: ButtonProps) => {
  return (
    <ChakraButton
      isDisabled={isDisabled}
      type={submit ? "submit" : "button"}
      variant={variant}
      size={size}
      {...rest}
    >
      <Typography variant={buttonTypographyMap[size]} color={"inherit"}>
        {children}
      </Typography>
    </ChakraButton>
  );
};

export default Button;

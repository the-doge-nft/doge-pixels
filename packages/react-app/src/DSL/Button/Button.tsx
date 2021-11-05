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

type ButtonSize = "xs" | "sm" | "md";

const buttonTypographyMap: { [k: string]: TVariant } = {
  sm: TVariant.Body14,
  md: TVariant.Body16,
  lg: TVariant.Body18,
};

const Button = ({ submit, children, variant = ButtonVariant.Primary, size = "sm", ...rest }: ButtonProps) => {
  return (
    <ChakraButton type={submit ? "submit" : "button"} variant={variant} {...rest}>
      <Typography variant={buttonTypographyMap[size]} color={"inherit"}>
        {children}
      </Typography>
    </ChakraButton>
  );
};

export default Button;

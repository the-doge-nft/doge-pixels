import React from "react";
import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from "@chakra-ui/react";

export enum ButtonVariant {
  Primary = "primary",
  Text = "text",
}

export interface ButtonProps extends ChakraButtonProps {
  submit?: boolean;
  type?: "submit" | "button";
  variant?: ButtonVariant;
}

const Button = ({ submit, children, variant = ButtonVariant.Primary, ...rest }: ButtonProps) => {
  return (
    <ChakraButton type={submit ? "submit" : "button"} variant={variant} {...rest}>
      {children}
    </ChakraButton>
  );
};

export default Button;

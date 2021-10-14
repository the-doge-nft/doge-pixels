import React from "react";
import {Button as ChakraButton, ButtonProps as ChakraButtonProps} from "@chakra-ui/react";
import Typography, {TVariant} from "../Typography/Typography";

export type ButtonVariantName = "primary" | "secondary" | "gray"

export enum ButtonVariant {
    Primary = "primary",
    Gray = "gray"
}

export interface ButtonProps extends ChakraButtonProps {
    submit?: boolean;
    type?: any;
    variant?: ButtonVariant
}

const Button = ({
    submit,
    children,
    variant = ButtonVariant.Primary,
    ...rest
}: ButtonProps) => {

    return (
        <ChakraButton type={submit ? "submit" : "button"} variant={variant} {...rest}>
            {children}
        </ChakraButton>
    )
}

export default Button
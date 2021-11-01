import React from "react";
import { Input as ChakraInput, InputProps as ChakraInputProps } from "@chakra-ui/react";

//@TODO: add custom components for other chakra form inputs
interface InputProps extends ChakraInputProps {}

export const Input = ({ ...rest }: InputProps) => {
  return <ChakraInput {...rest} />;
};

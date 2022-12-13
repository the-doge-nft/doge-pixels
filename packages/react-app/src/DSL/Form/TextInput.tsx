import { FormErrorMessage } from "@chakra-ui/react";
import React from "react";
import TextField from "../TextField/TextField";
import Control from "./Control";
import { AllowedStyleProps, BaseInputProps } from "./interfaces";
import { useControlledFormField, useFormField } from "./useFormField";

export interface TextInputProps extends BaseInputProps, AllowedStyleProps {
  icon?: any;
  onClear?: () => void;
}

const TextInput = React.forwardRef(
  (
    {
      name,
      placeholder,
      label,
      validate,
      initialValue,
      value,
      onChange,
      horizontal = false,
      icon,
      ...rest
    }: TextInputProps,
    ref,
  ) => {
    const { isRequired, inputValue, inputOnChange, restInput, meta } = useFormField(validate, name, initialValue);
    useControlledFormField(inputOnChange, value);
    return (
      <Control name={name} isRequired={isRequired} label={label} horizontal={horizontal}>
        <TextField
          {...restInput}
          {...rest}
          name={name}
          value={inputValue}
          onChange={value => {
            if (onChange) {
              onChange(value);
            }
            inputOnChange(value);
          }}
        />
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </Control>
    );
  },
);

export default TextInput;

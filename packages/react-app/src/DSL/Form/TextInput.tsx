import Control from "./Control";
import { FormErrorMessage } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { AllowedStyleProps, BaseInputProps } from "./interfaces";
import { Input } from "./Input/Input";
import { useControlledFormField, useFormField } from "./useFormField";

interface TextInputProps extends BaseInputProps, AllowedStyleProps {}

const TextInput = ({
  name,
  placeholder,
  label,
  validate,
  initialValue,
  value,
  onChange,
  horizontal = false,
  ...rest
}: TextInputProps) => {
  const { isRequired, inputValue, inputOnChange, restInput, meta } = useFormField(validate, name, initialValue);
  useControlledFormField(inputOnChange, value);

  return (
    <Control name={name} isRequired={isRequired} label={label} horizontal={horizontal}>
      <Input
        id={name}
        placeholder={placeholder}
        {...restInput}
        {...rest}
        onChange={e => {
          // TODO: below input change could be put in else only to trigger if onChange not passed
          // forcing the above useEffect to be present
          const value = e.target.value;
          if (onChange) {
            onChange(value);
          }
          inputOnChange(value);
        }}
        value={inputValue}
      />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </Control>
  );
};

export default TextInput;

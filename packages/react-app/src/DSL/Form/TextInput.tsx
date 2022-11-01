import { FormErrorMessage, InputGroup, InputLeftElement, useColorMode } from "@chakra-ui/react";
import React from "react";
import Icon from "../Icon/Icon";
import { lightOrDarkMode } from "../Theme";
import Control from "./Control";
import { Input } from "./Input/Input";
import { AllowedStyleProps, BaseInputProps } from "./interfaces";
import { useControlledFormField, useFormField } from "./useFormField";

export interface TextInputProps extends BaseInputProps, AllowedStyleProps {
  icon?: any;
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

    const iconWidth = "55px";

    const { colorMode } = useColorMode();
    return (
      <Control name={name} isRequired={isRequired} label={label} horizontal={horizontal}>
        <InputGroup>
          {icon && (
            <InputLeftElement
              zIndex={0}
              top={"50%"}
              transform={"translateY(-50%)"}
              width={iconWidth}
              children={<Icon icon={icon} />}
            />
          )}
          <Input
            ref={ref}
            id={name}
            placeholder={placeholder}
            _placeholder={{ color: lightOrDarkMode(colorMode, "yellow.100", "gray.100") }}
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
            pl={icon ? iconWidth : "inherit"}
          />
        </InputGroup>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </Control>
    );
  },
);

export default TextInput;

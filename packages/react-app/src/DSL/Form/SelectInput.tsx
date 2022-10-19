import React from "react";
import Control from "./Control";
import { BaseInputProps } from "./interfaces";
import { FormErrorMessage, Select, SelectProps } from "@chakra-ui/react";
import { useControlledFormField, useFormField } from "./useFormField";

export type SelectItem = {
  id: string;
  name: string;
};

export interface SelectInputProps extends SelectProps, Pick<BaseInputProps, "label" | "validate" | "initialValue"> {
  items: SelectItem[];
  variant?: string;
}

const SelectInput = ({
  items,
  name,
  label,
  validate,
  onChange,
  value,
  variant,
  initialValue,
  ...rest
}: SelectInputProps) => {
  const { isRequired, inputValue, inputOnChange, restInput, meta } = useFormField(validate, name, initialValue);
  useControlledFormField(inputOnChange, value);

  return (
    <Control name={name} label={label} isRequired={isRequired}>
      <Select
        {...rest}
        {...restInput}
        value={inputValue}
        onChange={e => {
          const value = e.target.value;
          if (onChange) {
            //@ts-ignore
            onChange(value);
          }
          inputOnChange(value);
        }}
        variant={variant}
      >
        {items.map(item => (
          <option value={item.id} key={item.id}>
            {item.name}
          </option>
        ))}
      </Select>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </Control>
  );
};

export default SelectInput;

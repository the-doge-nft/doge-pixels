import React, { useEffect } from "react";
import { Box, FormErrorMessage, Switch } from "@chakra-ui/react";
import { BaseInputProps } from "./interfaces";
import Control from "./Control";
import { observer } from "mobx-react-lite";
import { composeValidators, required } from "./validation";
import { useField } from "react-final-form";
import { useFormField } from "./useFormField";
import { isContext } from "vm";

interface ToggleInputProps extends BaseInputProps {}

const ToggleInput = observer(
  ({ validate, name, initialValue, label, horizontal, onChange, value }: ToggleInputProps) => {
    const { isRequired, inputValue, inputOnChange, restInput, meta } = useFormField(validate, name, initialValue, true);

    useEffect(() => {
      if (value !== undefined && value !== null) {
        inputOnChange(value);
      }
    }, [value]);

    return (
      <Control name={name} isRequired={isRequired} label={label} horizontal={horizontal}>
        <Switch
          {...restInput}
          id={name}
          name={name}
          isChecked={inputValue}
          //@TODO: look at other handlers here - if controlled inputOnChange should only be called when value changes in the useEffect
          onChange={e => {
            const value = e.target.checked;
            if (onChange) {
              onChange(value);
            } else {
              inputOnChange(value);
            }
          }}
          value={name}
        />
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </Control>
    );
  },
);

export default ToggleInput;
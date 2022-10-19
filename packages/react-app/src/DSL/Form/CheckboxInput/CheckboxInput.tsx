import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import Control from "../Control";
import { BaseInputProps } from "../interfaces";
import { useControlledFormField, useFormField } from "../useFormField";
import { Checkbox, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import Typography, { TVariant } from "../../Typography/Typography";

const CheckboxInput = observer(
  ({ validate, name, initialValue, label, horizontal, onChange, value }: BaseInputProps) => {
    const { isRequired, inputValue, inputOnChange, restInput, meta } = useFormField(validate, name, initialValue, true);

    useEffect(() => {
      if (value !== undefined && value !== null) {
        inputOnChange(value);
      }
      // eslint-disable-next-line
    }, [value]);

    useControlledFormField(inputOnChange, value);

    return (
      <Control name={name} isRequired={isRequired} horizontal={horizontal}>
        <Checkbox
          {...restInput}
          defaultChecked={Boolean(initialValue)}
          id={name}
          name={name}
          isChecked={inputValue}
          onChange={e => {
            const value = e.target.checked;
            if (onChange) {
              onChange(value);
            } else {
              inputOnChange(value);
            }
          }}
          value={name}
          size={"md"}
        >
          {label && (
            <FormLabel htmlFor={name} mb={1}>
              <Typography variant={TVariant.ComicSans14}>{label}</Typography>
            </FormLabel>
          )}
        </Checkbox>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </Control>
    );
  },
);

export default CheckboxInput;

import React from "react";
import {
  Box,
  FormErrorMessage,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput as ChakraNumberInput,
  NumberInputField,
  NumberInputStepper,
  useMultiStyleConfig,
} from "@chakra-ui/react";
import Control from "../Control";
import { AllowedStyleProps, BaseInputProps } from "../interfaces";
import { useControlledFormField, useFormField } from "../useFormField";
import Typography, { TVariant } from "../../Typography/Typography";
import { observer } from "mobx-react-lite";

export interface NumberInputProps extends BaseInputProps, AllowedStyleProps {
  stepper?: boolean;
  size?: any;
  showValidation?: boolean;
  sx?: any;
  showBigInputDrop?: boolean;
}

const NumberInput = observer(
  ({
    stepper,
    validate,
    name,
    initialValue,
    value,
    placeholder,
    onChange,
    size,
    label,
    showValidation = true,
    horizontal,
    isDisabled,
    showBigInputDrop = false,
    ...rest
  }: NumberInputProps) => {
    const { isRequired, inputValue, inputOnChange, restInput, meta } = useFormField(validate, name, initialValue);
    useControlledFormField(inputOnChange, value);

    const styles = useMultiStyleConfig("BigText", { size: "md" });

    return (
      <Control name={name} isRequired={isRequired} label={label} horizontal={horizontal}>
        <ChakraNumberInput
          size={size}
          value={inputValue}
          onChange={value => {
            if (onChange) {
              onChange(value);
            }
            inputOnChange(value);
          }}
          isDisabled={isDisabled}
          isRequired={isRequired}
        >
          <Box position={"relative"} mx={3} overflow={"hidden"} overflowWrap={"anywhere"}>
            <NumberInputField
              {...restInput}
              {...rest}
              id={name}
              // _invalid={meta.error && meta.touched}
              placeholder={placeholder}
            />
            {showBigInputDrop && (
              <Typography
                sx={{ ...styles.drop, top: "4px", right: "4px", overflowWrap: "inherit", left: "auto" }}
                variant={TVariant.PresStart95}
                block
              >
                {inputValue}
              </Typography>
            )}
          </Box>
          {stepper && (
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          )}
        </ChakraNumberInput>
        {showValidation && (
          <FormErrorMessage>
            <Typography color={"red.500"} variant={TVariant.ComicSans14}>
              {meta.error}
            </Typography>
          </FormErrorMessage>
        )}
      </Control>
    );
  },
);

export default NumberInput;

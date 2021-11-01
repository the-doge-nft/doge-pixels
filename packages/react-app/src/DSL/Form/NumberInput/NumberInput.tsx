import React, {useEffect} from "react";
import {
    FormErrorMessage,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput as ChakraNumberInput,
    NumberInputField,
    NumberInputStepper
} from "@chakra-ui/react";
import {composeValidators, required} from "../validation";
import {useField} from "react-final-form";
import Control from "../Control";
import {AllowedStyleProps, BaseInputProps} from "../interfaces";
import {useControlledFormField, useFormField} from "../useFormField";


export interface NumberInputProps extends BaseInputProps, AllowedStyleProps {
    stepper?: boolean;
    size?: any;
    showValidation?: boolean;
}

const NumberInput = ({
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
                         ...rest
}: NumberInputProps) => {
    const {isRequired, inputValue, inputOnChange, restInput, meta} = useFormField(validate, name, initialValue)
    useControlledFormField(inputOnChange, value)

    return (
        <Control name={name} isRequired={isRequired} label={label} horizontal={horizontal}>
            <ChakraNumberInput
                size={size}
                value={inputValue}
                onChange={(value) => {
                    if (onChange) {
                        onChange(value)
                    }
                    inputOnChange(value)
                }}
                isDisabled={isDisabled}
            >
                <NumberInputField
                    {...restInput}
                    {...rest}
                    id={name}
                    isInvalid={meta.error && meta.touched}
                    placeholder={placeholder}
                />
                {stepper && <NumberInputStepper>
                    <NumberIncrementStepper/>
                    <NumberDecrementStepper/>
                </NumberInputStepper>}
            </ChakraNumberInput>
            {showValidation && <FormErrorMessage>
                {meta.error}
            </FormErrorMessage>}
        </Control>
    )
}

export default NumberInput

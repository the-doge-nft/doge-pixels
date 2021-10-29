import React, {useEffect, useState} from "react";
import {FormErrorMessage, FormLabel, InputGroup, InputRightElement} from "@chakra-ui/react";
import Button, {ButtonVariant} from "../Button/Button";
import {composeValidators, required, ValidatorFunction} from "./validation";
import Control from "./Control";
import {useField} from "react-final-form";
import Typography, {TVariant} from "../Typography/Typography";
import {Input} from "./Input/Input";
import {AllowedStyleProps, BaseInputProps} from "./interfaces";
import {useFormField} from "./useFormField";
import Icon from "../Icon/Icon";

interface PasswordInputProps extends BaseInputProps, AllowedStyleProps {

}

const PasswordInput = ({name, placeholder, label, validate, value, onChange, horizontal, initialValue, ...rest}: PasswordInputProps) => {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    const {isRequired, inputValue, inputOnChange, restInput, meta} = useFormField(validate, name, initialValue)

    useEffect(() => {
        if (value !== undefined && value !== null) {
            inputOnChange(value)
        }
    }, [value])

    return (
        <Control label={label} name={name} isRequired={isRequired} horizontal={horizontal}>
            <InputGroup>
                <Input
                    {...restInput}
                    {...rest}
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    isInvalid={meta.error && meta.touched}
                    onChange={(e) => {
                        const value = e.target.value
                        if (onChange) {
                            onChange(value)
                        }
                        inputOnChange(value)
                    }}
                    value={inputValue}
                    pr={10}
                    overflow={"scroll"}
                />
                <InputRightElement mr={1}>
                    <Button size={"xs"} variant={ButtonVariant.Text} onClick={handleClick}>
                        <Icon boxSize={3} icon={show ? "eye-closed" : "eye-open"} color={"gray.600"}/>
                    </Button>
                </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
                {meta.error}
            </FormErrorMessage>
        </Control>
    )
}

export default PasswordInput

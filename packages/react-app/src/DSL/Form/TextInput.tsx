import Control from "./Control";
import { FormErrorMessage, InputGroup, InputRightElement, useColorMode } from "@chakra-ui/react";
import React from "react";
import { AllowedStyleProps, BaseInputProps } from "./interfaces";
import { Input } from "./Input/Input";
import { useControlledFormField, useFormField } from "./useFormField";
import Icon from "../Icon/Icon";
import { lightOrDarkMode } from "../Theme";

export interface TextInputProps extends BaseInputProps, AllowedStyleProps {
  rightIcon?: any
}

const TextInput = React.forwardRef(({
                                           name,
                                           placeholder,
                                           label,
                                           validate,
                                           initialValue,
                                           value,
                                           onChange,
                                           horizontal = false,
                                           rightIcon,
                                           ...rest
                                       }: TextInputProps, ref) => {
    const { isRequired, inputValue, inputOnChange, restInput, meta } = useFormField(validate, name, initialValue);
    useControlledFormField(inputOnChange, value);

    const rightIconWidth = "60px"

    const {colorMode} = useColorMode()
    return (
        <Control name={name} isRequired={isRequired} label={label} horizontal={horizontal}>
            <InputGroup>
                <Input
                    ref={ref}
                    id={name}
                    placeholder={placeholder}
                    _placeholder={{color: lightOrDarkMode(colorMode, "yellow.100", "gray.100")}}
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
                    pr={rightIcon ? rightIconWidth : "inherit"}
                />
                {rightIcon && <InputRightElement zIndex={0} top={"50%"} transform={"translateY(-50%)"} width={rightIconWidth} children={<Icon icon={rightIcon}/>}/>}
            </InputGroup>
            <FormErrorMessage>{meta.error}</FormErrorMessage>
        </Control>
    );
})

export default TextInput;

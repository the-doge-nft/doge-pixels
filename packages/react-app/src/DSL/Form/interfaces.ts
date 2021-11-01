import {ValidatorFunction} from "./validation";
import {StyleProps} from "@chakra-ui/styled-system";
import {OtherProps} from "@chakra-ui/react";

export type BaseInputValidators = ValidatorFunction[] | ValidatorFunction

export interface BaseInputProps {
    name: string;
    placeholder?: string;
    label?: string;
    validate?: BaseInputValidators;
    initialValue?: string | boolean;
    value?: string | boolean;
    onChange?: (params: any) => any;
    horizontal?: boolean;
    autoFocus?: boolean;
    isDisabled?: boolean;
}


export interface AllowedStyleProps extends Omit<StyleProps, keyof OtherProps> {

}



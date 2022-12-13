import { Input, InputGroup, InputLeftElement, InputRightElement, useColorMode } from "@chakra-ui/react";
import React from "react";
import { TextInputProps } from "../Form/TextInput";
import Icon from "../Icon/Icon";
import { lightOrDarkMode } from "../Theme";

interface TextFieldProps extends TextInputProps {}

const TextField = React.forwardRef(
  ({ icon, placeholder, onChange, value, name, onClear, ...rest }: TextFieldProps, ref) => {
    const iconWidth = "55px";
    const { colorMode } = useColorMode();
    return (
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
          //@ts-ignore
          ref={ref}
          id={name}
          placeholder={placeholder}
          _placeholder={{ color: lightOrDarkMode(colorMode, "yellow.100", "gray.100") }}
          onChange={e => {
            if (onChange) {
              onChange(e.target.value);
            }
          }}
          value={value}
          pl={icon ? iconWidth : "inherit"}
          {...rest}
        />
        {onClear && value !== "" && (
          <InputRightElement
            onClick={onClear}
            zIndex={10}
            top={"50%"}
            transform={"translateY(-50%)"}
            width={iconWidth}
            children={<Icon cursor={"pointer"} onClick={onClear} icon={"close"} />}
          />
        )}
      </InputGroup>
    );
  },
);

export default TextField;

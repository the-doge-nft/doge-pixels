//https://chakra-ui.com/docs/theming/advanced#multipart-or-composite-component
const SelectStyle = {
    parts: ["field", "icon"],
    baseStyle: {
        icon: {
            color: "gray.500"
        },
        field: {
            fontWeight: "semibold",
            _hover: {
                cursor: "pointer"
            },
            _disabled: {
                bg: "gray.100",
                borderColor: "gray.300"
            }
        },
    },
    variants: {
        gray: {
            field: {
                bg: "gray.50",
                color: "black",
            }
        },
        outline: {
            field: {
                bg: "gray.50",
                color: "black",
                border: "1px solid",
                borderColor: "gray.100",
                _hover: {
                    borderColor: "gray.200"
                }
            }
        }
    },
    sizes: {
        sm: {
            field: {
                height: 10,
                borderRadius: 9
            }
        }
    },
    defaultProps: {
        size: "sm",
        variant: "gray",
    }
}

export default SelectStyle

import {GlobalFont} from "../Typography/Typography.style";

const ButtonStyle = {
    baseStyle: {
        fontFamily: GlobalFont,
        fontWeight: "600",
        _active: {
            transform: "translateY(2px)",
            boxShadow: "none"
        },
        _focus: {
            boxShadow: "none"
        },
        _hover: {
            boxShadow: "none"
        }
    },
    variants: {
        primary: {
            bg: "white",
            color: "black",
            borderColor: "black",
            borderStyle: "solid",
        },
        text: {
            border: "none",
            bg: "none",
            color: "black",
            _hover: {
                textDecoration: "underline"
            }
        }
    },
    sizes: {
        xs: {
            borderWidth: "1px",
            borderRadius: 5,
            px: "4px",
            fontSize: "12px"
        },
        sm: {
            borderWidth: "3px",
            borderRadius: 9,
            px: "12px",
            fontSize: "16px"
        },
        md: {
            borderWidth: "3px",
            borderRadius: 11,
            px: "14px",
            fontSize: "18px"
        }
    },
    defaultProps: {
        size: "sm",
        variant: "primary"
    }
}

export default ButtonStyle
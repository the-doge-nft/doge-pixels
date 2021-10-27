import {GlobalFont} from "../Typography/Typography.style";

const ButtonStyle = {
    baseStyle: {
        fontFamily: GlobalFont,
        fontWeight: "600",
        _active: {
            transform: "translateY(1px)"
        }
    },
    variants: {
        primary: {
            bg: "blue.500",
            color: "white",
            _hover: {
                bg: "blue.400"
            }
        },
        gray: {
            bg: "gray.50",
            color: "black",
            _hover: {
                bg: "gray.100"
            }
        }
    },
    sizes: {
        xs: {
            borderRadius: 5,
            px: "4px",
            fontSize: "12px"
        },
        sm: {
            borderRadius: 9,
            px: "12px",
            fontSize: "14px"
        },
        md: {
            borderRadius: 11,
            px: "14px",
            fontSize: "16px"
        }
    },
    defaultProps: {
        size: "sm",
        variant: "primary"
    }
}

export default ButtonStyle
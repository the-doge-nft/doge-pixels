//https://chakra-ui.com/docs/theming/advanced#multipart-or-composite-component
import {colorModeType, lightOrDark} from "../Theme";
import {Type} from "../Fonts/Fonts";

const SelectStyle = {
    parts: ["field", "icon"],
    baseStyle: ({colorMode}: { colorMode: colorModeType }) => ({
        icon: {
            color: lightOrDark(colorMode, "black", "white"),
        },
        field: {
            dropShadow: "10px 10px 0px black",
            _hover: {
                cursor: "pointer",
            },
            fontFamily: Type.PresStart
        },
        drop: {
            zIndex: 0,
            position: "absolute",
            bottom: "-8px",
            left: "8px",
            w: "full",
            h: "full",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: lightOrDark(colorMode, "black", "white")
        }
    }),
    variants: {
        solid: ({colorMode}: { colorMode: colorModeType }) => ({
            field: {
                bg: lightOrDark(colorMode, "yellow.50", "purple.700"),
                borderColor: lightOrDark(colorMode, "black", "white"),
                borderWidth: "1px",
                borderRadius: "0px",
                color: lightOrDark(colorMode, "black", "white"),
                display: "inline-block"
            },
            drop: {
                borderImageSlice: "1 1",
                bg: lightOrDark(colorMode, "black", "none")
            }
        }),
    },
    sizes: {
        sm: {
            field: {
                height: 10,
                borderRadius: 9,
            },
        },
    },
    defaultProps: {
        size: "sm",
        variant: "solid",
    },
};

export default SelectStyle;

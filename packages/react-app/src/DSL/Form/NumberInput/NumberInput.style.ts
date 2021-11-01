import {GlobalFont} from "../../Typography/Typography.style";

export const NumberInputStyle = {
    parts: ["root", "field", "stepperGroup", "stepper"],
    baseStyle: {
        field: {
            fontFamily: GlobalFont,
            _disabled: {
                bg: "gray.100"
            }
        }
    },
    variants: {
        gray: {
            field: {
                color: "black",
                bg: "gray.50"
            }
        }
    },
    defaultProps: {
        variant: "gray"
    }

}

export default NumberInputStyle

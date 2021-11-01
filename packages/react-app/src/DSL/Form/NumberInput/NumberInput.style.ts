import { GlobalFont } from "../../Typography/Typography.style";

export const NumberInputStyle = {
  parts: ["root", "field", "stepperGroup", "stepper"],
  baseStyle: {
    field: {
      fontFamily: GlobalFont,
      _disabled: {
        bg: "gray.100",
      },
      border: "3px solid black",
      bg: "white",
    },
  },
  variants: {
    gray: {
      field: {
        color: "black",
      },
    },
  },
  defaultProps: {
    variant: "gray",
  },
};

export default NumberInputStyle;

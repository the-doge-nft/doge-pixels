import { GlobalFont } from "../../Typography/Typography.style";

export const InputStyle = {
  parts: ["field", "addon"],
  baseStyle: {
    field: {
      fontFamily: GlobalFont,
    },
  },
  variants: {
    gray: {
      field: {
        color: "black",
        bg: "gray.50",
      },
    },
  },
  defaultProps: {
    variant: "gray",
  },
};

export default InputStyle;

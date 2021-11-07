import { GlobalFont } from "../../Typography/Typography.style";
import { colorModeType, darkModePrimary, lightOrDark } from "../../Theme";

export const NumberInputStyle = {
  parts: ["root", "field", "stepperGroup", "stepper"],
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    field: {
      fontFamily: GlobalFont,
      _disabled: {
        bg: "purple.50",
      },
      bg: lightOrDark(colorMode, "white", darkModePrimary),
      color: lightOrDark(colorMode, "black", "white"),
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: lightOrDark(colorMode, "black", "white"),
    },
    stepper: {
      borderColor: lightOrDark(colorMode, "black", "white"),
      borderWidth: "1px",
    },
  }),
  variants: ({ colorMode }: { colorMode: colorModeType }) => ({
    gray: {
      field: {
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: lightOrDark(colorMode, "black", "white"),
        borderRadius: "3px",
      },
    },
  }),
  defaultProps: {
    variant: "gray",
  },
};

export default NumberInputStyle;

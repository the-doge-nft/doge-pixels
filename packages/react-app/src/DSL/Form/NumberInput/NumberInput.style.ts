import { GlobalFont } from "../../Typography/Typography.style";
import { colorModeType, darkModePrimary, lightOrDarkMode } from "../../Theme";

export const NumberInputStyle = {
  parts: ["root", "field", "stepperGroup", "stepper"],
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    field: {
      fontFamily: GlobalFont,
      bg: lightOrDarkMode(colorMode, "yellow.50", darkModePrimary),
      color: lightOrDarkMode(colorMode, "black", "white"),
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: lightOrDarkMode(colorMode, "black", "white"),
      borderRadius: "0px",
    },
    stepper: {
      borderColor: lightOrDarkMode(colorMode, "black", "white"),
      borderWidth: "1px",
      borderRadius: "0px",
      border: "none",
    },
  }),
  variants: ({ colorMode }: { colorMode: colorModeType }) => ({
    gray: {
      field: {
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: lightOrDarkMode(colorMode, "black", "white"),
      },
      stepper: {
        borderRadius: "0px",
      },
    },
  }),
  sizes: {
    md: {
      field: {
        borderRadius: "0px",
      },
      stepper: {
        borderRadius: "0px",
      },
    },
  },
  defaultProps: {
    variant: "gray",
    size: "md",
  },
};

export default NumberInputStyle;

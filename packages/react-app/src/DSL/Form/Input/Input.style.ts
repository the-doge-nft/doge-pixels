import { GlobalFont } from "../../Typography/Typography.style";
import { colorModeType, lightOrDarkMode } from "../../Theme";

export const InputStyle = {
  parts: ["field", "addon"],
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    field: {
      fontFamily: GlobalFont,
      borderWidth: "1px",
      borderStyle: "style",
      borderColor: lightOrDarkMode(colorMode, "black", "white"),
      color: lightOrDarkMode(colorMode, "black", "white"),
      _focus: {
        _placeholder: {
          color: "transparent",
        },
      },
      // borderRadius: "0px"
    },
  }),
  variants: {
    outline: ({ colorMode }: { colorMode: colorModeType }) => ({
      field: {
        px: 5,
        py: 6,
        borderColor: "black",
        borderRadius: "50px",
        boxShadow: "none",
        _hover: {
          borderColor: lightOrDarkMode(colorMode, "black", "white"),
          boxShadow: "none",
        },
        _focus: {
          borderColor: lightOrDarkMode(colorMode, "black", "white"),
          boxShadow: "none",
        },
        _placeholder: {
          color: lightOrDarkMode(colorMode, "black", "white"),
        },
      },
    }),
  },
};

export default InputStyle;

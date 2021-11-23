import { GlobalFont } from "../../Typography/Typography.style";
import {colorModeType, lightOrDark} from "../../Theme";

export const InputStyle = {
  parts: ["field", "addon"],
  baseStyle: ({colorMode}: {colorMode: colorModeType}) => ({
    field: {
      fontFamily: GlobalFont,
      borderWidth: "1px",
      borderStyle: "style",
      borderColor: lightOrDark(colorMode, "black", "white"),
      color: lightOrDark(colorMode, "black", "white"),
      // borderRadius: "0px"
    },
  }),
  variants: {
    outline: ({colorMode}: {colorMode: colorModeType}) => ({
      field: {
        px: 5,
        py: 6,
        borderColor: "black",
        borderRadius: "50px",
        boxShadow: "none",
        _hover: {
          borderColor: lightOrDark(colorMode, "black", "white"),
          boxShadow: "none",
        },
        _focus: {
          borderColor: lightOrDark(colorMode, "black", "white"),
          boxShadow: "none",
        },
        _placeholder: {
          color: lightOrDark(colorMode, "black", "white")
        }
      },
    })
  }
};

export default InputStyle;

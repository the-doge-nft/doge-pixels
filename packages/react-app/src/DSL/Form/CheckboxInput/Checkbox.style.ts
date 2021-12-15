import {colorModeType, lightOrDark} from "../../Theme";

const CheckboxStyle = {
  parts: ["icon", "control", "label"],
  baseStyle: ({colorMode}: {colorMode: colorModeType}) => ({
    control: {
      borderColor: lightOrDark(colorMode, "black", "white"),
      borderWidth: "1px",
      borderRadius: "0px",
      color: lightOrDark(colorMode, "black", "white"),
      _focus: {
        boxShadow: "none"
      },
      _active: {
        boxShadow: "none"
      },
      _checked: {
        color: lightOrDark(colorMode, "black", "white"),
        borderColor: lightOrDark(colorMode, "black", "white"),
        bg: lightOrDark(colorMode, "yellow.50", "purple.700"),
        _hover: {
          bg: lightOrDark(colorMode, "yellow.50", "purple.700"),
          borderColor: lightOrDark(colorMode, "black", "white"),
        }
      }
    }
  })
}

export default CheckboxStyle

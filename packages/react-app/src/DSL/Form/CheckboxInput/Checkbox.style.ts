import {colorModeType, lightOrDark} from "../../Theme";

const CheckboxStyle = {
  parts: ["icon", "control", "label"],
  baseStyle: ({colorMode}: {colorMode: colorModeType}) => ({
    control: {
      borderColor: lightOrDark(colorMode, "black", "white"),
      borderWidth: "1px",
      borderRadius: "0px",
      color: "black",
      _focus: {
        boxShadow: "none"
      },
      _active: {
        boxShadow: "none"
      },
      _checked: {
        color: "black",
        borderColor: "black",
        bg: "yellow.50",
        _hover: {
          bg: "yellow.50",
          borderColor: "black",
        }
      }
    }
  })
}

export default CheckboxStyle

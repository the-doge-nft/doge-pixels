import { colorModeType, lightOrDark } from "../Theme"

const IconStyle = {
  baseStyle: ({colorMode}: {colorMode: colorModeType}) => ({
    color: lightOrDark(colorMode, "black", "white")
  })
}

export default IconStyle

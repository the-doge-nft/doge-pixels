import {colorModeType, lightOrDark} from "../Theme";

const PillStyle = {
  baseStyle: ({colorMode}: {colorMode: colorModeType}) => ({
    bg: lightOrDark(colorMode, "yellow.700", "purple.100"),
    borderRadius: 100,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: lightOrDark(colorMode, "black", "white")
  }),
  sizes: {
    sm: {
      px: 2,
      py: 1
    }
  }
}

export default PillStyle

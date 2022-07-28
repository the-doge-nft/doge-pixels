import {colorModeType, lightOrDark} from "../Theme";

const ColorPaneStyle = {
  parts: ["container"],
  baseStyle: ({colorMode}: {colorMode: colorModeType}) => ({
    container: {
      display: "inline-flex",
      flexDirection: "column",
      maxWidth: "fit-content",
      position: "relative",
    
    },
    swatch: {
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: lightOrDark(colorMode, "black", "white"),
      width: "30px",
      height: "30px"
    },
  }),
  variants: {
    shadow: ({colorMode}: {colorMode: colorModeType}) => ({
      drop: {
        display: "block"
      }
    })
  },
}

export default ColorPaneStyle

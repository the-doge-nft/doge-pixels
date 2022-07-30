import {colorModeType, lightOrDark} from "../Theme";

const ColorPaneStyle = {
  parts: ["container"],
  baseStyle: ({colorMode}: {colorMode: colorModeType}) => ({
    
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

import {colorModeType, lightOrDark} from "../Theme";

const DrawerStyle = {
  parts: ["overlay", "dialogContainer", "dialog", "header", "closeButton", "body", "footer"],
  baseStyle: ({colorMode}: {colorMode: colorModeType}) => ({
    dialog: {
      bg: lightOrDark(colorMode, "yellow.50", "purple.700"),
      width: "90%",
      margin: "auto"
    }
  })
}

export default DrawerStyle

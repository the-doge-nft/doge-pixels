import {colorModeType, lightOrDark} from "../Theme";

const DrawerStyle = {
  parts: ["overlay", "dialogContainer", "dialog", "header", "closeButton", "body", "footer"],
  baseStyle: ({colorMode}: {colorMode: colorModeType}) => ({
    dialog: {
      bg: lightOrDark(colorMode, "yellow.50", "purple.700"),
      // mt: 10
      // width: "90%",
      // margin: "auto"
    }
  }),
  sizes: {
    // lg: {
    //   header: {
    //     px: 18
    //   },
    //   body: {
    //     px: 18
    //   }
    // }
  }
}

export default DrawerStyle

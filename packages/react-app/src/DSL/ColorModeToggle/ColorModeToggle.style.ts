import {colorModeType, lightOrDark} from "../Theme";

const containerWidth = 130
const containerXPadding = 10

const ColorModeToggleStyle = {
  parts: ["container", "handle", "dogImage"],
  baseStyle: ({colorMode}: { colorMode: colorModeType }) => ({
    container: {
      color: lightOrDark(colorMode,"black", "white"),
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      borderRadius: "35px",
      width: `${containerWidth}px`,
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: lightOrDark(colorMode,"black", "white"),
      boxShadow: "8px 8px 0px black",
      _hover: {
        cursor: "pointer"
      },
      _active: {
        transform: "translate(4px, 4px)",
        boxShadow: "4px 4px 0px black"
      },
      px: `${containerXPadding}px`,
      py: "8px"
    },
  })
}

export default ColorModeToggleStyle;

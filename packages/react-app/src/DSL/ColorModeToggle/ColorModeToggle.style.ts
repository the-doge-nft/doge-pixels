import {colorModeType, lightOrDark} from "../Theme";

const containerWidth = 130
const containerXPadding = 10
const handleSize = 35

export const colorModeToggleSizes = {

}

const ColorModeToggleStyle = {
  parts: ["container", "handle", "dogImage", "leftIcon", "rightIcon"],
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
      boxShadow: "8px 8px 0px",
      _hover: {
        cursor: "pointer"
      },
      _active: {
        transform: "translate(4px, 4px)",
        boxShadow: `4px 4px 0px ${lightOrDark(colorMode,"black", "white")}`
      },
      px: `${containerXPadding}px`,
      py: "8px",
      userSelect: "none",
      msUserSelect: "none",
      webkitUserSelect: "none"
    },
    handle: {
      position: "relative",
      background: lightOrDark(colorMode, "black", "white"),
      borderRadius: 100,
      width: `${handleSize}px`,
      height: `${handleSize}px`,
      zIndex: 1,
      overflow: "hidden",
      left: lightOrDark(colorMode, "0", `${containerWidth - (2*containerXPadding) - handleSize}px`)
    },
    dogeImage: {
      maxWidth: "140%",
      width: "140%",
      height: "140%",
      position: "relative",
      top: lightOrDark(colorMode, "3px", "2px"),
      right: lightOrDark(colorMode, "18px", "-2px"),
      // position: "absolute",
      // right: lightOrDark(colorMode, "2px", ""),
    },
    leftIcon: {
      left: `${containerXPadding}px`,
      position: "absolute",
      ml: 2
    },
    rightIcon: {
      right: `${containerXPadding}px`,
      position: "absolute",
      mr: 2
    }
  })
}

export default ColorModeToggleStyle;

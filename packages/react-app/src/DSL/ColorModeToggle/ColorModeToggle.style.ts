import {colorModeType, lightOrDark} from "../Theme";

const containerWidth = 130
const containerXPadding = 10
const handleSize = 35

export const colorModeToggleSizes = {

}

const ColorModeToggleStyle = {
  parts: ["container", "handle", "dogImage", "leftIcon", "rightIcon", "drop"],
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
      _hover: {
        cursor: "pointer"
      },
      _active: {
        transform: "translate(4px, 4px)",
      },
      px: `${containerXPadding}px`,
      py: "8px",
      userSelect: "none",
      msUserSelect: "none",
      webkitUserSelect: "none",
      zIndex: 2,
      bg: lightOrDark(colorMode, "yellow.50", "purple.700")
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
    },
    drop: {
      zIndex: -1,
      position: "absolute",
      width: `${containerWidth}px`,
      height: "100%",
      borderRadius: "35px",
      bg: lightOrDark(colorMode, "black", "purple.700"),
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: lightOrDark(colorMode, "black", "white"),
      top: "10px",
      left: "10px",
      // display: "none"
    }
  })
}

export default ColorModeToggleStyle;

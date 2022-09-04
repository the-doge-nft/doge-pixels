import { colorModeType, lightOrDarkMode } from "../Theme";

const containerWidth = 115;
const containerXPadding = 10;
const handleSize = 30;

export const colorModeToggleSizes = {};

const ColorModeToggleStyle = {
  parts: ["container", "handle", "dogImage", "leftIcon", "rightIcon", "drop"],
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    container: {
      color: lightOrDarkMode(colorMode, "black", "white"),
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      borderRadius: "35px",
      width: `${containerWidth}px`,
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: lightOrDarkMode(colorMode, "black", "white"),
      _hover: {
        cursor: "pointer",
      },
      _active: {
        transform: "translate(6px, 6px)",
      },
      px: `${containerXPadding}px`,
      py: "8px",
      userSelect: "none",
      msUserSelect: "none",
      webkitUserSelect: "none",
      zIndex: 2,
      bg: lightOrDarkMode(colorMode, "yellow.50", "purple.700"),
    },
    // WARNING: these are params to style prop on motion.div
    handle: {
      position: "relative",
      // background: lightOrDark(colorMode, "black", "#180E30"),
      border: lightOrDarkMode(colorMode, "1px solid black", "1px solid white"),
      borderRadius: 100,
      width: `${handleSize}px`,
      height: `${handleSize}px`,
      zIndex: 1,
      overflow: "hidden",
      left: lightOrDarkMode(colorMode, "0", `${containerWidth - 2 * containerXPadding - handleSize}px`),
    },
    dogeImage: {
      maxWidth: "140%",
      width: "140%",
      height: "140%",
      position: "relative",
      top: lightOrDarkMode(colorMode, "3px", "2px"),
      right: lightOrDarkMode(colorMode, "18px", "-2px"),
    },
    leftIcon: {
      left: `${containerXPadding}px`,
      position: "absolute",
      ml: 2,
    },
    rightIcon: {
      right: `${containerXPadding}px`,
      position: "absolute",
      mr: 2,
    },
    drop: {
      zIndex: -1,
      position: "absolute",
      width: `${containerWidth}px`,
      height: "100%",
      borderRadius: "35px",
      bg: lightOrDarkMode(colorMode, "black", "purple.700"),
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: lightOrDarkMode(colorMode, "black", "white"),
      top: "10px",
      left: "10px",
      // display: "none"
    },
  }),
};

export default ColorModeToggleStyle;

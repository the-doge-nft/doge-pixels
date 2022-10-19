import { lightOrDarkMode } from "../Theme";

const TypeaheadStyle = {
  parts: ["input", "box", "item"],
  baseStyle: ({ colorMode }) => ({
    box: {
      bg: lightOrDarkMode(colorMode, "yellow.50", "purple.700"),
      color: lightOrDarkMode(colorMode, "black", "white"),
      borderWidth: "1px",
      borderColor: lightOrDarkMode(colorMode, "black", "white"),
      borderRadius: "15px",
      mt: 2,
      zIndex: 100,
      position: "absolute",
      w: "full",
      p: 2,
      maxHeight: "300px",
      overflowY: "auto",
      overflowX: "hidden",
    },
    item: {
      textAlign: "left",
      overflowWrap: "anywhere",
      cursor: "pointer",
      p: 2,
      borderRadius: "15px",
      _hover: {
        bg: lightOrDarkMode(colorMode, "yellow.700", "magenta.50"),
      },
    },
  }),
};

export default TypeaheadStyle;

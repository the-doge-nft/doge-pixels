import { colorModeType, lightOrDarkMode } from "../Theme";

const PixelPaneStyle = {
  parts: ["container", "swatch", "textContainer"],
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    container: {
      display: "inline-flex",
      flexDirection: "column",
      maxWidth: "fit-content",
      maxHeight: "fit-content",
      position: "relative",
    },
    swatch: {
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: lightOrDarkMode(colorMode, "black", "white"),
    },
    textContainer: {
      borderColor: lightOrDarkMode(colorMode, "black", "white"),
      bg: lightOrDarkMode(colorMode, "yellow.50", "purple.700"),
      borderStyle: "solid",
      borderLeftWidth: "1px",
      borderRightWidth: "1px",
      borderBottomWidth: "1px",
    },
    drop: {
      display: "none",
      zIndex: -1,
      position: "absolute",
      w: "full",
      h: "full",
      top: "8px",
      left: "8px",
      bg: lightOrDarkMode(colorMode, "black", "purple.700"),
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: lightOrDarkMode(colorMode, "black", "white"),
    },
  }),
  sizes: {
    xxs: {
      swatch: {
        w: "20px",
        h: "20px",
      },
      textContainer: {
        display: "none",
      },
    },
    xs: {
      swatch: {
        w: "70px",
        h: "70px",
      },
      textContainer: {
        py: 0,
        px: 0.5,
      },
    },
    sm: {
      swatch: {
        w: "85px",
        h: "85px",
      },
      textContainer: {
        py: 0,
        px: 1,
      },
    },
    md: {
      swatch: {
        w: "100px",
        h: "100px",
      },
      textContainer: {
        py: 0,
        px: 1,
      },
    },
    lg: {
      swatch: {
        w: "180px",
        h: "180px",
      },
      textContainer: {
        py: 1,
        px: 2,
      },
    },
  },
  variants: {
    shadow: ({ colorMode }: { colorMode: colorModeType }) => ({
      drop: {
        display: "block",
      },
    }),
  },
};

export default PixelPaneStyle;

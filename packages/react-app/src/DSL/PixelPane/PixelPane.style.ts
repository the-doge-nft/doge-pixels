import {colorModeType, lightOrDark} from "../Theme";

const PixelPaneStyle = {
  parts: ["container", "swatch", "textContainer"],
  baseStyle: ({colorMode}: {colorMode: colorModeType}) => ({
    container: {
      display: "flex",
      flexDirection: "column",
    },
    swatch: {
      w: "100%",
      h: "100%",
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: lightOrDark(colorMode, "black", "white")
    },
    textContainer: {
      borderColor: lightOrDark(colorMode, "black", "white"),
      bg: lightOrDark(colorMode, "yellow.50", "purple.700"),
      borderStyle: "solid",
      borderLeftWidth: "1px",
      borderRightWidth: "1px",
      borderBottomWidth: "1px"
    }
  }),
  variants: {
    shadow: ({colorMode}: {colorMode: colorModeType}) => ({
      container: {
        boxShadow: lightOrDark(colorMode, "10px 10px 0px black", "10px 10px 0px white")
      }
    })
  },
  sizes: {
    sm: {
      container: {
        w: "100px",
        h: "110px"
      },
      textContainer: {
        py: 0,
        px: 1
      }
    },
    md: {
      container: {
        w: "100px",
        h: "140px"
      },
      textContainer: {
        py: 0,
        px: 1
      }
    },
    lg: {
      container: {
        w: "180px",
        h: "230px",
      },
      textContainer: {
        py: 1,
        px: 2
      }
    }
  }
}

export default PixelPaneStyle

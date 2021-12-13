import { colorModeType, lightOrDark } from "../Theme";


const ModalStyle = {
  parts: ["container", "body", "title", "drop"],
  baseStyle: ({colorMode}: {colorMode: colorModeType}) => ({
    container: {
      width: "100%",
      borderRadius: "0px",
      background: lightOrDark(colorMode, "yellow.50", "purple.700"),
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: lightOrDark(colorMode, "black", "white"),
      // padding: "10px",
      /* 👇 because of the drag handle */
      pt: "0px",
      pointerEvents: "all",
      overflow: "hidden",
      position: "relative"
    },
    drop: {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: "8px",
      left: "8px",
      zIndex: -1,
      border: lightOrDark(colorMode, "1px solid black", "1px solid white"),
      bg: lightOrDark(colorMode, "black", "transparent"),
    }
  }),
  sizes: {
    xs: {
      container: {
        maxWidth: "20rem"
      },
      body: {
        p: 0
      }
    },
    sm: {
      container: {
        maxWidth: "24rem"
      },
      body: {
        px: 8,
        pb: 12
      },
      title: {
        mt: 8,
        mb: 2
      }
    },
    md: {
      container: {
        maxWidth: "28rem"
      },
      body: {
        px: 8,
        pb: 12
      },
      title: {
        mt: 8,
        mb: 2
      }
    },
    lg: {
      container: {
        maxWidth: "36rem"
      },
      body: {
        px: 10,
        pb: 12
      },
      title: {
        mt: 8,
        mb: 6
      }
    },
  }
}

export default ModalStyle


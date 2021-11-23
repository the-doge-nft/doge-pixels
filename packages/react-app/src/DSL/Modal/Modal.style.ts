import { colorModeType, lightOrDark } from "../Theme";


const ModalStyle = {
  parts: ["container", "body", "title"],
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
      boxShadow: lightOrDark(colorMode, "10px 10px 0px black", "10px 10px 0px white"),
      overflow: "hidden",
      position: "relative"
    },
    body: {
      px: 8,
      pb: 12
    },
    title: {
      mt: 8,
      mb: 2
    }
  }),
  sizes: {
    sm: {
      container: {
        maxWidth: "24rem"
      },
    },
    md: {
      container: {
        maxWidth: "28rem"
      }
    },
    lg: {
      container: {
        maxWidth: "32rem"
      }
    },
    xl: {
      container: {
        maxWidth: "36rem"
      }
    }
  }
}

export default ModalStyle


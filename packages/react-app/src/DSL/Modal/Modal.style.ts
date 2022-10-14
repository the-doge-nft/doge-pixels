import { colorModeType, lightOrDarkMode } from "../Theme";
import { paneDropOffset } from "../Pane/Pane.styles";

const ModalStyle = {
  parts: ["container", "body", "title", "drop", "description"],
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    container: {
      width: "100%",
      borderRadius: "0px",
      background: lightOrDarkMode(colorMode, "yellow.50", "purple.700"),
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: lightOrDarkMode(colorMode, "black", "white"),
      // padding: "10px",
      /* 👇 because of the drag handle */
      // pt: "0px",
      pointerEvents: "all",
      overflow: "hidden",
      position: "relative",
    },
    drop: {
      position: "absolute",
      width: "100%",
      height: "100%",
      left: `${paneDropOffset}px`,
      bottom: `-${paneDropOffset}px`,
      zIndex: -1,
      border: lightOrDarkMode(colorMode, "1px solid black", "1px solid white"),
      bg: lightOrDarkMode(colorMode, "black", "purple.700"),
    },
    description: {
      mt: 2,
    },
    body: {
      p: 4
    }
  }),
  sizes: {
    xs: {
      container: {
        maxWidth: "20rem",
      },
      body: {
        p: 0,
      },
    },
    sm: {
      container: {
        maxWidth: "24rem",
      },
      title: {
        mt: 8,
      },
    },
    md: {
      container: {
        maxWidth: "28rem",
      },
      title: {
        mt: 8,
      },
    },
    lg: {
      container: {
        maxWidth: "36rem",
      },
      drop: {
        maxWidth: "36rem",
      },
      title: {
        mt: 8,
      },
    },
  },
};

export default ModalStyle;

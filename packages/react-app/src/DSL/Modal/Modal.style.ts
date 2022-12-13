import { colorModeType, lightOrDarkMode } from "../Theme";

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
    description: {
      mt: 2,
    },
    body: {
      p: 6,
    },
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
    },
    md: {
      container: {
        maxWidth: "28rem",
      },
    },
    lg: {
      container: {
        maxWidth: "36rem",
      },
      drop: {
        maxWidth: "36rem",
      },
    },
  },
};

export default ModalStyle;

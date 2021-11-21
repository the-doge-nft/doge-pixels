import {darkModePrimary, lightOrDark} from "../Theme";
import { GlobalFont } from "../Typography/Typography.style";

const ModalStyle = {
  parts: ["overlay", "dialogContainer", "dialog", "header", "closeButton", "body", "footer"],
  baseStyle: ({ colorMode }: { colorMode: "light" | "dark" }) => ({
    overlay: {
      bg: "rgba(0,0,0,0.5)",
    },
    dialogContainer: {
      // border: "2px solid black"
    },
    closeButton: {
      color: colorMode === "light" ? "black" : "white",
      _hover: {
        bg: "none",
        border: "none",
        fontWeight: "bold",
        boxShadow: "none",
      },
      _active: {
        boxShadow: "none",
        transform: "translate(2px, 2px)"
      },
      _focus: {
        boxShadow: "none",
      },
      fontSize: "18px",
      fontFamily: GlobalFont,
      position: "static",
      borderRadius: "0px",
      borderLeft: "1px solid black"
      // top: 0,
      // right: 0
    },
    dialog: {
      bg: colorMode === "light" ? "yellow.50" : darkModePrimary,
      border: "2px solid",
      borderColor: colorMode === "light" ? "black" : "white",
      borderRadius: "0px",
      boxShadow: `14px 14px 0px ${lightOrDark(colorMode, "black", "white")}`,
    },
    header: {
      px: 12,
      mt: 4
    },
    body: {
      px: 12,
      pb: 6
    }
  }),
};

export default ModalStyle;

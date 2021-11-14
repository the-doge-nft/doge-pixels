import { darkModePrimary } from "../Theme";
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
    },
    dialog: {
      bg: colorMode === "light" ? "yellow.50" : darkModePrimary,
      border: "2px solid",
      borderColor: colorMode === "light" ? "black" : "white",
      borderRadius: "0px",
    },
  }),
};

export default ModalStyle;

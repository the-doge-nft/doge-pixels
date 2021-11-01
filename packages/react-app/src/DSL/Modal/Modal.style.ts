import { darkModePrimary } from "../Theme";

const ModalStyle = {
  parts: ["overlay", "dialogContainer", "dialog", "header", "closeButton", "body", "footer"],
  baseStyle: ({ colorMode }: { colorMode: "light" | "dark" }) => ({
    overlay: {
      bg: "rgba(0,0,0,0.5)",
    },
    dialogContainer: {
      // border: "2px solid black"
    },
    dialog: {
      bg: colorMode === "light" ? "white" : darkModePrimary,
      border: "4px solid",
      borderColor: colorMode === "light" ? "black" : "white",
      borderRadius: "0px",
    },
  }),
};

export default ModalStyle;

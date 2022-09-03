import { colorModeType, lightOrDarkMode } from "../Theme";

const DrawerStyle = {
  parts: ["overlay", "dialogContainer", "dialog", "header", "closeButton", "body", "footer"],
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    dialog: {
      bg: lightOrDarkMode(colorMode, "yellow.50", "purple.700"),
    },
    body: {
      height: "100%",
    },
  }),
  sizes: {},
};

export default DrawerStyle;

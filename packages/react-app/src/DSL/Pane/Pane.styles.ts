import { colorModeType, darkModePrimary, lightOrDarkMode } from "../Theme";

export const paneDropOffset = 14;

const PaneStyle = {
  parts: ["container", "text"],
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    container: {
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: lightOrDarkMode(colorMode, "black", "white"),
      background: lightOrDarkMode(colorMode, "yellow.50", darkModePrimary),
      position: "relative",
      h: "full",
    },
  }),
  sizes: {
    sm: {
      container: { p: 2 },
    },
    lg: {
      container: { p: 9 },
    },
  },
  title: {},
  defaultProps: {
    size: "lg",
  },
};

export default PaneStyle;

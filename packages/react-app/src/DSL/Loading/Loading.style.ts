import { colorModeType, darkModeGradient, lightOrDarkMode } from "../Theme";

const LoadingStyle = {
  parts: ["container", "pixel"],
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    container: {
      p: "6px",
      overflow: "hidden",
      position: "relative",
      display: "flex",
      maxWidth: "300px",
      w: "100%",
      h: "50px",
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: lightOrDarkMode(colorMode, "black", "white"),
    },
    pixel: {
      bg: lightOrDarkMode(colorMode, "black", darkModeGradient),
      mr: 2,
      display: "inline-block",
      height: "100%",
      width: "20px",
      flexShrink: 0,
    },
  }),
};

export default LoadingStyle;

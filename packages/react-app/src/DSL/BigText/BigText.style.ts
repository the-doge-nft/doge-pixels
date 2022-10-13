import { colorModeType, darkModeGradient, lightOrDarkMode } from "../Theme";

const BigTextStyle = {
  parts: ["main", "label", "drop"],
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    main: {
      border: "none",
      height: "auto",
      bg: lightOrDarkMode(colorMode, "yellow.700", darkModeGradient),
      backgroundClip: "text",
      opactiy: 1,
      WebkitBackgroundClip: "text",

      textFillColor: "transparent",
      WebkitTextFillColor: "transparent",

      WebkitTextStroke: lightOrDarkMode(colorMode, "1px black", "1px transparent"),
      overflowWrap: "initial",
      userSelect: "none",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      w: "full",
      overflow: "hidden",
    },
    label: {
      bg: lightOrDarkMode(colorMode, "yellow.50", darkModeGradient),
      backgroundClip: "text",
      WebkitBackgroundClip: "text",

      textFillColor: "transparent",
      WebkitTextFillColor: "transparent",

      WebkitTextStroke: lightOrDarkMode(colorMode, "1px black", "2px transparent"),
      border: "none",
      height: "auto",
      userSelect: "none",
    },
    drop: {
      zIndex: -1,
      position: "absolute",
      top: "4px",
      left: "4px",
      background: lightOrDarkMode(colorMode, "black", darkModeGradient),
      WebkitBackgroundClip: "text",
      WebkitTextStroke: lightOrDarkMode(colorMode, "none", "2px transparent"),
      color: lightOrDarkMode(colorMode, "black", "purple.700"),
      border: "none",
      userSelect: "none",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      w: "full",
      overflow: "hidden",
    },
  }),
  sizes: {
    sm: ({ colorMode }: { colorMode: colorModeType }) => ({}),
    md: ({ colorMode }: { colorMode: colorModeType }) => ({}),
  },
};

export default BigTextStyle;

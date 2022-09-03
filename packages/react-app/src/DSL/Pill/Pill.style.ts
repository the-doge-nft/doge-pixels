import { colorModeType, lightOrDarkMode } from "../Theme";

const PillStyle = {
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    bg: lightOrDarkMode(colorMode, "yellow.700", "purple.100"),
    borderRadius: 100,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: lightOrDarkMode(colorMode, "black", "white"),
  }),
  sizes: {
    sm: {
      px: 2,
      py: 1,
    },
  },
};

export default PillStyle;

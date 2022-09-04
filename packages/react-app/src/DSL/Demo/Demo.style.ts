import { colorModeType, darkModePrimary, lightOrDarkMode } from "../Theme";

const DemoStyle = {
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    bg: lightOrDarkMode(colorMode, "yellow.50", darkModePrimary),
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: lightOrDarkMode(colorMode, "black", "white"),
    borderRadius: "0px",
  }),
};

export default DemoStyle;

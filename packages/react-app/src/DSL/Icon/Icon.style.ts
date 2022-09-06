import { colorModeType, lightOrDarkMode } from "../Theme";

const IconStyle = {
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    color: lightOrDarkMode(colorMode, "black", "white"),
  }),
};

export default IconStyle;

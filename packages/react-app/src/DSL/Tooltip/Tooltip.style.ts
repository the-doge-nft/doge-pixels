import { Type } from "../Fonts/Fonts";
import { lightOrDarkMode } from "../Theme";

const TooltipStyle = {
  baseStyle: ({ colorMode }) => ({
    bg: lightOrDarkMode(colorMode, "yellow.50", "purple.700"),
    color: lightOrDarkMode(colorMode, "black", "white"),
    borderWidth: "1px",
    borderColor: lightOrDarkMode(colorMode, "black", "white"),
    borderRadius: "0px",
    fontFamily: Type.ComicSans,
  }),
  variants: {},
};

export default TooltipStyle;

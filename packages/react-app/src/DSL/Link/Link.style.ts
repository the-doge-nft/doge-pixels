import { colorModeType, lightOrDarkMode } from "../Theme";
import { Type } from "../Fonts/Fonts";

const LinkStyle = {
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    maxW: "fit-content",
    fontFamily: Type.PresStart,
    textDecoration: "none",
    color: lightOrDarkMode(colorMode, "black", "white"),
    boxShadow: "none",
    display: "inline-block",
    textUnderlineOffset: "5px",
    _active: {
      boxShadow: "none",
    },
    _focus: {
      boxShadow: "none",
    },
    _hover: {
      textDecoration: "underline",
      transform: "translate(4px 4px)",
    },
  }),
  sizes: {
    sm: {
      fontSize: "13px",
    },
    md: {
      fontSize: "16px",
    },
    lg: {
      fontSize: "26px",
    },
  },
  variants: {
    [Type.ComicSans]: {
      fontFamily: Type.ComicSans,
    },
    [Type.PresStart]: {
      fontFamily: Type.PresStart,
    },
  },
  defaultProps: {
    size: "md",
    variant: Type.PresStart,
  },
};

export default LinkStyle;

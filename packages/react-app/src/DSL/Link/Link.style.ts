import {colorModeType, lightOrDark} from "../Theme";
import {Type} from "../Fonts/Fonts";

const LinkStyle = {
  baseStyle: ({colorMode}: {colorMode: colorModeType}) => ({
    fontFamily: Type.PresStart,
    textDecoration: "none",
    color: lightOrDark(colorMode, "black", "white"),
    boxShadow: "none",
    display: "inline-block",
    textUnderlineOffset: "5px",
    _active: {
      boxShadow: "none",
    },
    _focus: {
      boxShadow: "none"
    },
    _hover: {
      textDecoration: "underline",
      transform: "translate(4px 4px)",
    }
  }),
  sizes: {
    sm: {
      fontSize: "10px"
    },
    md: {
      fontSize: "15px"
    },
    lg: {
      fontSize: "26px"
    }
  },
  variants: {
    [Type.ComicSans]: {
      fontFamily: Type.ComicSans
    },
    [Type.PresStart]: {
      fontFamily: Type.PresStart
    }
  }
}

export default LinkStyle

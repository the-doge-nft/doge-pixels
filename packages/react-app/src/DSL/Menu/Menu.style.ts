import {Type} from "../Fonts/Fonts";
import {colorModeType, lightOrDark} from "../Theme";

const MenuStyle = {
  parts: ["button", "list", "item", "groupTitle", "command", "divider"],
  baseStyle: ({colorMode}: {colorMode: colorModeType}) => ({
    button: {
      bg: lightOrDark(colorMode, "yellow.50", "purple.700"),
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: lightOrDark(colorMode, "black", "white"),
      p: 2,
      borderRadius: "100px",
      boxShadow: lightOrDark(colorMode, "10px 10px 0px black", "10px 10px 0px white"),
      _hover: {
        cursor: "pointer"
      },
      _active: {
        transform: "translate(4px, 4px)",
        boxShadow: `4px 4px 0px ${lightOrDark(colorMode,"black", "white")}`
      },
    },
    item: {
      color: lightOrDark(colorMode, "black", "white"),
      bg: lightOrDark(colorMode, "yellow.50", "purple.700"),
      fontWeight: "normal",
      fontSize: "14px",
      fontFamily: Type.PresStart,
      _hover: {
        bg: lightOrDark(colorMode, "yellow.50", "purple.700"),
        textDecoration: "underline"
      },
      _active: {
        fontWeight: "semibold",
      },
      _focus: {
        bg: lightOrDark(colorMode, "yellow.50", "purple.700"),
      },
    },
    list: {
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: lightOrDark(colorMode, "black", "white"),
      bg: lightOrDark(colorMode, "yellow.50", "purple.700"),
      zIndex: 2
    },
  }),
  variants: {},
  defaultProps: {},
};

export default MenuStyle;

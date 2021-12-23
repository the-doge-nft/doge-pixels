import {Type} from "../Fonts/Fonts";
import {colorModeType, lightOrDark} from "../Theme";

const MenuStyle = {
  parts: ["button", "list", "item", "groupTitle", "command", "divider", "drop"],
  baseStyle: ({colorMode}: {colorMode: colorModeType}) => ({
    button: {
      bg: lightOrDark(colorMode, "yellow.50", "purple.700"),
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: lightOrDark(colorMode, "black", "white"),
      px: 3,
      py: 2,
      borderRadius: "30px",
      _hover: {
        cursor: "pointer"
      },
      _active: {
        transform: "translate(4px, 4px)",
      },
      height: "50px"
    },
    item: {
      color: lightOrDark(colorMode, "black", "white"),
      bg: lightOrDark(colorMode, "yellow.50", "purple.700"),
      fontWeight: "normal",
      fontSize: "14px",
      fontFamily: Type.PresStart,
      mt: 2,
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
      py: 5,
      mt: 2,
      borderRadius: "12px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: lightOrDark(colorMode, "black", "white"),
      bg: lightOrDark(colorMode, "yellow.50", "purple.700"),
      zIndex: 2,
      boxShadow: lightOrDark(colorMode, "6px 6px 0px black", "none")
      // boxShadow: `6px 6px 0px ${lightOrDark(colorMode,"black", "white")}`,
    },
    drop: {
      position: "absolute",
      w: "full",
      h: "full",
      bg: lightOrDark(colorMode, "black", "purple.700"),
      top: "10px",
      left: "10px",
      borderRadius: "30px",
      zIndex: -1,
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: lightOrDark(colorMode, "black", "white")
    }
  }),
  variants: {},
  defaultProps: {},
};

export default MenuStyle;

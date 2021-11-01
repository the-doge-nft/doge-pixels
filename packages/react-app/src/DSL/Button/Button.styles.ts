import { GlobalFont } from "../Typography/Typography.style";
import {darkModePrimary} from "../Theme";

const ButtonStyle = {
  baseStyle: {
    _active: {
      transform: "translateY(2px)",
      boxShadow: "none",
    },
    _focus: {
      boxShadow: "none",
    },
    _hover: {
      boxShadow: "none",
    },
  },
  variants: {
    primary: ({colorMode}: {colorMode: "light" | "dark"}) => ({
      bg: colorMode === "light" ? "white" : darkModePrimary,
      borderColor: colorMode === "light" ? "black" : "white",
      borderStyle: "solid",
      textDecorationColor: colorMode === "light" ? "black" : "white",
      color: colorMode === "light" ? "black" : "white"
    }),
    text: ({colorMode}: {colorMode: "light" | "dark"}) => ({
      border: "none",
      bg: "none",
      textDecorationColor: colorMode === "light" ? "black" : "white",
      // needed for text decoration coloring
      color: colorMode === "light" ? "black" : "white"
    }),
  },
  sizes: {
    xs: {
      borderWidth: "1px",
      borderRadius: 5,
      px: "4px",
    },
    sm: {
      borderWidth: "3px",
      borderRadius: 9,
      px: "12px",
    },
    md: {
      borderWidth: "3px",
      borderRadius: 11,
      px: "14px",
    },
  },
};

export default ButtonStyle;

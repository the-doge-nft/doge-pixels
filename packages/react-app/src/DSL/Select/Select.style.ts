//https://chakra-ui.com/docs/theming/advanced#multipart-or-composite-component
import { colorModeType, lightOrDarkMode } from "../Theme";
import { Type } from "../Fonts/Fonts";

const SelectStyle = {
  parts: ["field", "icon"],
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    icon: {
      color: lightOrDarkMode(colorMode, "black", "white"),
    },
    field: {
      dropShadow: "10px 10px 0px black",
      _hover: {
        cursor: "pointer",
      },
      fontFamily: Type.PresStart,
      w: "100%",
    },
    drop: {
      zIndex: 0,
      position: "absolute",
      bottom: "-8px",
      left: "8px",
      w: "full",
      h: "full",
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: lightOrDarkMode(colorMode, "black", "white"),
    },
  }),
  variants: {
    solid: ({ colorMode }: { colorMode: colorModeType }) => ({
      field: {
        bg: lightOrDarkMode(colorMode, "yellow.50", "purple.700"),
        borderColor: lightOrDarkMode(colorMode, "black", "white"),
        borderWidth: "1px",
        borderRadius: "0px",
        color: lightOrDarkMode(colorMode, "black", "white"),
        display: "inline-block",
      },
      drop: {
        borderImageSlice: "1 1",
        bg: lightOrDarkMode(colorMode, "black", "none"),
      },
    }),
  },
  sizes: {
    sm: {
      field: {
        height: 10,
        borderRadius: 9,
      },
    },
  },
  defaultProps: {
    size: "sm",
    variant: "solid",
  },
};

export default SelectStyle;

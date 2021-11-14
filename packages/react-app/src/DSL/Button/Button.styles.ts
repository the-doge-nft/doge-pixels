import { GlobalFont } from "../Typography/Typography.style";
import { colorModeType, darkModePrimary, lightOrDark } from "../Theme";
import { SystemStyleObject } from "@chakra-ui/react";

const ButtonStyle = {
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    _hover: {
      // boxShadow: "none",
    },
    color: lightOrDark(colorMode, "black", "white"),
    textDecorationColor: lightOrDark(colorMode, "black", "white"),
    borderWidth: "1px",
  }),
  variants: {
    primary: ({ colorMode }: { colorMode: colorModeType }) => ({
      bg: lightOrDark(colorMode, "yellow.50", darkModePrimary),
      borderColor: lightOrDark(colorMode, "black", "white"),
      borderRadius: "0px",
      borderStyle: "solid",
      boxShadow: "8px 8px 0px 0px black",
      _active: {
        transform: "translate(4px, 4px)",
        boxShadow: "4px 4px 0px 0px black",
        _disabled: {
        },
      },
      _focus: {
        boxShadow: "8px 8px 0px 0px black",
        // "boxShadow": "auto"
      },
      _hover: {
        bg: "yellow.700",
        _disabled: {
          color: "gray.900",
        },
        _focus: {
          // boxShadow: "4px 4px 0px 0px black",
          // "boxShadow": "auto"
        },
      },
    }),
    text: ({ colorMode }: { colorMode: colorModeType }) => ({
      border: "none",
      bg: "none",
      _hover: {
        textDecoration: "underline",
      },
    }),
  },
  sizes: {
    sm: {
      p: "14px",
      height: "inherit"
    },
    // md: {
    //   px: "8px",
    // },
    // lg: {
    //   px: "10px",
    // },
  },
  defaultProps: {},
};

export default ButtonStyle;

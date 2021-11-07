import { GlobalFont } from "../Typography/Typography.style";
import { colorModeType, darkModePrimary, lightOrDark } from "../Theme";
import { SystemStyleObject } from "@chakra-ui/react";

const ButtonStyle = {
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    _active: {
      transform: "translateY(2px)",
      boxShadow: "none",
      _disabled: {
        transform: "none",
      },
    },
    _focus: {
      boxShadow: "none",
    },
    _hover: {
      boxShadow: "none",
    },
    color: lightOrDark(colorMode, "black", "white"),
    textDecorationColor: lightOrDark(colorMode, "black", "white"),
  }),
  variants: {
    primary: ({ colorMode }: { colorMode: colorModeType }) => ({
      bg: lightOrDark(colorMode, "white", darkModePrimary),
      borderColor: lightOrDark(colorMode, "black", "white"),
      borderStyle: "solid",
      _hover: {
        color: "yellow.100",
        backgroundImage: "linear-gradient(#7014AC, #B467B6)",
        _disabled: {
          color: "gray.900",
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
      borderWidth: "2px",
      borderRadius: 7,
      px: "2px",
    },
    md: {
      borderWidth: "2px",
      borderRadius: 9,
      px: "8px",
    },
    lg: {
      borderWidth: "2px",
      borderRadius: 11,
      px: "10px",
    },
  },
  defaultProps: {},
};

export default ButtonStyle;

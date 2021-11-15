import { colorModeType, darkModePrimary, lightOrDark } from "../Theme";

const ButtonStyle = {
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    color: lightOrDark(colorMode, "black", "white"),
    textDecorationColor: lightOrDark(colorMode, "black", "white"),
    borderWidth: "1px",
  }),
  variants: {
    primary: ({ colorMode }: { colorMode: colorModeType }) => ({
      bg: lightOrDark(colorMode, "yellow.50", darkModePrimary),
      borderColor: lightOrDark(colorMode, "black", "white"),
      color: lightOrDark(colorMode, "black", "white"),
      borderRadius: "0px",
      borderStyle: "solid",
      boxShadow: "8px 8px 0px 0px",
      _hover: {
        bg: "yellow.700",
        _disabled: {
          color: "gray.900",
        },
      },
      _focus: {
        boxShadow: "8px 8px 0px 0px",
      },
      _active: {
        transform: "translate(4px, 4px)",
        boxShadow: "4px 4px 0px 0px",
        _disabled: {
          boxShadow: "none"
        }
      },
    }),
    text: ({ colorMode }: { colorMode: colorModeType }) => ({
      border: "none",
      bg: "none",
      textUnderlineOffset: "4px",
      _active: {
        transform: "translate(2px, 2px)"
      },
      _hover: {
        textDecoration: "underline",
      },
      _focus: {
        boxShadow: "none"
      }
    }),
  },
  sizes: {
    sm: {
      p: "14px",
      height: "inherit"
    },
  },
  defaultProps: {},
};

export default ButtonStyle;

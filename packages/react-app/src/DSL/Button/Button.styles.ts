import {colorModeType, darkModeGradient, darkModePrimary, lightOrDark} from "../Theme";

const ButtonStyle = {
  parts: ["container", "button", "drop"],
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    container: {
      _focus: {
        boxShadow: "none"
      },
      _active: {
        boxShadow: "none"
      }
    },
    button: {
      color: lightOrDark(colorMode, "black", "white"),
      textDecorationColor: lightOrDark(colorMode, "black", "white"),
      borderWidth: "1px",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    drop: {
      zIndex: -1,
      position: "absolute",
      bottom: "-8px",
      left: "8px",
      w: "full",
      h: "full",
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: lightOrDark(colorMode, "black", "white")
    }
  }),
  variants: {
    primary: ({ colorMode }: { colorMode: colorModeType }) => ({
      button: {
        bg: lightOrDark(colorMode, "yellow.50", darkModePrimary),
        borderColor: lightOrDark(colorMode, "black", "white"),
        color: lightOrDark(colorMode, "black", "white"),
        borderRadius: "0px",
        borderStyle: "solid",
        boxShadow: "none",
        minWidth: "fit-content",
        transition: "background 0s ease",
        w: "full",
        _hover: {
          bg: lightOrDark(colorMode, "yellow.700", darkModeGradient),
          borderImageSource: lightOrDark(colorMode, "none", darkModeGradient),
          borderImageSlice: "1 1",
          _disabled: {
            color: lightOrDark(colorMode, "#d6ceb6", "#482e84"),
            borderColor: lightOrDark(colorMode, "#d6ceb6", "#482e84"),
            bg: lightOrDark(colorMode, "yellow.50", "purple.700")
          },
        },
        _focus: {
          boxShadow: "none",
        },
        _active: {
          transform: "translate(4px, 4px)",
          boxShadow: "none",
          _disabled: {
            boxShadow: "none",
            transform: "translate(1px, 1px)"
          },
          _focus: {
            boxShadow: "none"
          }
        },
        _disabled: {
          color: lightOrDark(colorMode, "#d6ceb6", "#482e84"),
          borderColor: lightOrDark(colorMode, "#d6ceb6", "#482e84"),
        }
      },
      drop: {
        borderImageSlice: "1 1",
        bg: lightOrDark(colorMode, "black", "none")
      }
    }),
    text: ({ colorMode }: { colorMode: colorModeType }) => ({
      button: {
        minWidth: "fit-content",
        borderRadius: "0px",
        border: "none",
        bg: "none",
        textUnderlineOffset: "4px",
        boxShadow: "none",
        _active: {
          boxShadow: "none",
          transform: "translate(2px, 2px)"
        },
        _hover: {
          boxShadow: "none",
          textDecoration: "underline",
        },
        _focus: {
          boxShadow: "none"
        },
        _disabled: {
          color: lightOrDark(colorMode, "#d6ceb6", "#482e84")
        }
      },
      drop: {
        display: "none"
      }
    }),
  },
  sizes: {
    sm: {
      button: {
        p: "14px",
        height: "inherit"
      }
    },
    md: {
      button: {
        p: "14px",
        height: "inherit"
      }
    },
    lg: {
      button: {
        p: "22px",
        height: "inherit"
      }
    }
  },
  defaultProps: {},
};

export default ButtonStyle;

import {colorModeType, darkModeGradient, lightOrDark} from "../Theme";

const BigTextStyle = {
  parts: ["main", "label", "drop"],
  baseStyle: ({colorMode}: {colorMode: colorModeType}) => ({
    main: {
      border: "none",
      height: "auto",
      bg: lightOrDark(colorMode, "yellow.700", darkModeGradient),
      backgroundClip: "text",
      opactiy: 1,
      "-webkit-background-clip": "text",

      textFillColor: "transparent",
      "-webkit-text-fill-color": "transparent",

      "-webkit-text-stroke": lightOrDark(colorMode, "1px black", "1px transparent"),
    },
    label: {
      bg: lightOrDark(colorMode, "yellow.50", darkModeGradient),
      backgroundClip: "text",
      "-webkit-background-clip": "text",

      textFillColor: "transparent",
      "-webkit-text-fill-color": "transparent",

      "-webkit-text-stroke": lightOrDark(colorMode, "1px black", "2px transparent"),
      border: "none",
      height: "auto"
    },
    drop: {
      zIndex: -1,
      position: "absolute",
      top: "4px",
      left: "4px",
      background: lightOrDark(colorMode, "black", darkModeGradient),
      "-webkit-background-clip": "text",
      "-webkit-text-stroke": lightOrDark(colorMode, "none", "2px transparent"),
      "color": lightOrDark(colorMode, "black","purple.700"),
      border: "none"
    }
  }),
  sizes: {
    sm: ({colorMode}: {colorMode: colorModeType}) => ({
      // main: {
      //   filter: lightOrDark(colorMode, "drop-shadow(4px 4px 0px black)", "none")
      // },
      // label: {
      //   filter: "drop-shadow(4px 4px 0px black)"
      // }
    }),
    md: ({colorMode}: {colorMode: colorModeType}) => ({
      // main: {
      //   filter: lightOrDark(colorMode, "drop-shadow(6px 6px 0px black)", "none")
      // },
      // label: {
      //   filter: "drop-shadow(6px 6px 0px black)"
      // }
    }),
  }
}

export default BigTextStyle

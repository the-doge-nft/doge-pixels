import {colorModeType, darkModeGradient, darkModePrimary, lightOrDark} from "../Theme";

const BigTextStyle = {
  parts: ["main", "label", "drop"],
  baseStyle: ({colorMode}: {colorMode: colorModeType}) => ({
    main: {
      border: "none",
      height: "auto",
      bg: lightOrDark(colorMode, "yellow.700", darkModeGradient),
      backgroundClip: "text",
      "-webkit-background-clip": "text",

      textFillColor: "transparent",
      "-webkit-text-fill-color": "transparent",

      "-webkit-text-stroke": lightOrDark(colorMode, "1px black", "none"),
    },
    label: {
      bg: lightOrDark(colorMode, "yellow.700", darkModeGradient),
      backgroundClip: "text",
      "-webkit-background-clip": "text",

      textFillColor: "transparent",
      "-webkit-text-fill-color": "transparent",

      "-webkit-text-stroke": "1px black",
      border: "none",
      height: "auto"
    },
    drop: {
      zIndex: -1,
      position: "absolute",
      top: "3px",
      left: "3px",
      background: lightOrDark(colorMode, "black", darkModeGradient),
      "-webkit-background-clip": lightOrDark(colorMode, "text","text"),
      "-webkit-text-stroke": lightOrDark(colorMode, "none", "2px transparent"),
      "color": lightOrDark(colorMode, "black","purple.700")
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

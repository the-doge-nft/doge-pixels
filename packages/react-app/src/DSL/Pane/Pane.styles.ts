import { colorModeType, darkModePrimary, lightOrDarkMode } from "../Theme";

export const paneDropOffset = 14;

const PaneStyle = {
  parts: ["container", "text"],
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    container: {
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: lightOrDarkMode(colorMode, "black", "white"),
      background: lightOrDarkMode(colorMode, "yellow.50", darkModePrimary),
      position: "relative",
      h: "full",
      p: 9,
      _after: {
        base: "none",
        md: {
          zIndex: "-1",
          content: "''",
          position: "absolute",
          width: "100%",
          height: "100%",
          left: `${paneDropOffset}px`,
          bottom: `-${paneDropOffset}px`,
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: lightOrDarkMode(colorMode, "black", "white"),
        },
      },
    },
    title: {},
  }),
  defaultProps: {},
};

export default PaneStyle;

import { colorModeType, darkModePrimary, lightOrDark } from "../Theme";

const PaneStyle = {
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: lightOrDark(colorMode, "black", "white"),
    background: lightOrDark(colorMode, "yellow.50", darkModePrimary),
    position: "relative",
    // zIndex: "1",
    _after: {
      zIndex: "-1",
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: "14px",
      bottom: "-14px",
      border: "1px solid black"
    }
  }),
  defaultProps: {},
};

export default PaneStyle;

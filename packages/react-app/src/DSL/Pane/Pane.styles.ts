import { colorModeType, lightOrDark } from "../Theme";

const PaneStyle = {
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: lightOrDark(colorMode, "black", "white"),
  }),
  defaultProps: {},
};

export default PaneStyle;

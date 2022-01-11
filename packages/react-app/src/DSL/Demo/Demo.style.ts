import { colorModeType, darkModePrimary, lightOrDark } from "../Theme";

const DemoStyle = {
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    bg: lightOrDark(colorMode, "yellow.50", darkModePrimary),
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: lightOrDark(colorMode, "black", "white"),
    borderRadius: "0px"
  }),
};

export default DemoStyle;

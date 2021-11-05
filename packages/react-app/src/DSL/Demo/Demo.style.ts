import { colorModeType, darkModePrimary, lightOrDark } from "../Theme";

const DemoStyle = {
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    bg: lightOrDark(colorMode, "white", darkModePrimary),
  }),
};

export default DemoStyle;

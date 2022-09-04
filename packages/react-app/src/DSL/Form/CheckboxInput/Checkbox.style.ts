import { colorModeType, lightOrDarkMode } from "../../Theme";

const CheckboxStyle = {
  parts: ["icon", "control", "label"],
  baseStyle: ({ colorMode }: { colorMode: colorModeType }) => ({
    control: {
      borderColor: lightOrDarkMode(colorMode, "black", "white"),
      borderWidth: "1px",
      borderRadius: "0px",
      color: lightOrDarkMode(colorMode, "black", "white"),
      _focus: {
        boxShadow: "none",
      },
      _active: {
        boxShadow: "none",
      },
      _checked: {
        color: lightOrDarkMode(colorMode, "black", "white"),
        borderColor: lightOrDarkMode(colorMode, "black", "white"),
        bg: lightOrDarkMode(colorMode, "yellow.50", "purple.700"),
        _hover: {
          bg: lightOrDarkMode(colorMode, "yellow.50", "purple.700"),
          borderColor: lightOrDarkMode(colorMode, "black", "white"),
        },
      },
    },
  }),
};

export default CheckboxStyle;

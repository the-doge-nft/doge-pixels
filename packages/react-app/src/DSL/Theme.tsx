import { extendTheme } from "@chakra-ui/react";
import ButtonStyle from "./Button/Button.styles";
import SelectStyle from "./Form/Select/Select.style";
import MenuStyle from "./Menu/Menu.style";
import TypographyStyle from "./Typography/Typography.style";
import InputStyle from "./Form/Input/Input.style";
import AccordionStyle from "./Accordion/Accordion.style";
import TagStyle from "./Tag/Tag.styles";
import NumberInputStyle from "./Form/NumberInput/NumberInput.style";
import ModalStyle from "./Modal/Modal.style";
import DemoStyle from "./Demo/Demo.style";
import Colors from "./Colors/Colors";

export const darkModePrimary = "purple.700";

export type colorModeType = "light" | "dark";
export const lightOrDark = (colorMode: colorModeType, ifLight: string, ifDark: string) => {
  return colorMode === "light" ? ifLight : ifDark;
};

// https://chakra-ui.com/docs/theming/customize-theme
const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
  styles: {
    global: ({ colorMode }: { colorMode: colorModeType }) => ({
      "html, body": {
        // detect what text is not intentionally themed
        color: "fuchsia",
        bg: lightOrDark(colorMode, "white", darkModePrimary),
      },
    }),
  },
  colors: Colors,
  components: {
    Button: ButtonStyle,
    Select: SelectStyle,
    Menu: MenuStyle,
    Text: TypographyStyle,
    Input: InputStyle,
    NumberInput: NumberInputStyle,
    Accordion: AccordionStyle,
    Tag: TagStyle,
    Modal: ModalStyle,
    Demo: DemoStyle,
  },
});

export default theme;

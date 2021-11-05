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
  colors: {
    blue: {
      "50": "#7587CB",
      "100": "#98DDF1",
    },
    yellow: {
      "50": "#F6E274",
      "100": "#FFD801",
    },
    purple: {
      "50": "#B467B6",
      "100": "#7014AC",
      "700": "#180E30",
    },
    gray: {
      "50": "#F1F2F3",
      "100": "#D8DBDF",
      "200": "#BFC4CA",
      "300": "#A6ADB5",
      "400": "#8D96A0",
      "500": "#74808B",
      "600": "#5D666F",
      "700": "#464D53",
      "800": "#2E3338",
      "900": "#171A1C",
    },
  },
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

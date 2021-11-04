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
import SliderStyle from "./Slider/Slider.style";
import TabsStyle from "./Tabs/Tabs.style";

export const darkModePrimary = "#180E30";

// https://chakra-ui.com/docs/theming/customize-theme
const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
  styles: {
    global: ({ colorMode }: { colorMode: "light" | "dark" }) => ({
      "html, body": {
        // detect what text is not intentionally themed
        color: "fuchsia",
        bg: colorMode === "light" ? "white" : darkModePrimary,
      },
    }),
  },
  colors: {
    blue: {
      "50": "#E5F3FF",
      "100": "#B8DDFF",
      "200": "#8AC6FF",
      "300": "#5CB0FF",
      "400": "#2E9AFF",
      "500": "#0084FF",
      "600": "#006ACC",
      "700": "#004F99",
      "800": "#003566",
      "900": "#001A33",
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
    Slider: SliderStyle,
    Tabs: TabsStyle
  },
});

export default theme;

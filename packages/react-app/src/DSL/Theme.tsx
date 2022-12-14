import { extendTheme } from "@chakra-ui/react";
import BigTextStyle from "./BigText/BigText.style";
import ButtonStyle from "./Button/Button.styles";
import ColorModeToggleStyle from "./ColorModeToggle/ColorModeToggle.style";
import Colors from "./Colors/Colors";
import DemoStyle from "./Demo/Demo.style";
import DrawerStyle from "./Drawer/Drawer.style";
import CheckboxStyle from "./Form/CheckboxInput/Checkbox.style";
import InputStyle from "./Form/Input/Input.style";
import NumberInputStyle from "./Form/NumberInput/NumberInput.style";
import IconStyle from "./Icon/Icon.style";
import LinkStyle from "./Link/Link.style";
import LoadingStyle from "./Loading/Loading.style";
import MenuStyle from "./Menu/Menu.style";
import ModalStyle from "./Modal/Modal.style";
import PaneStyle from "./Pane/Pane.styles";
import PillStyle from "./Pill/Pill.style";
import PixelPaneStyle from "./PixelPane/PixelPane.style";
import SelectStyle from "./Select/Select.style";
import TagStyle from "./Tag/Tag.styles";
import ToastStyle from "./Toast/Toast.style";
import TooltipStyle from "./Tooltip/Tooltip.style";
import TypeaheadStyle from "./Typeahead/Typeahead.style";
import TypographyStyle from "./Typography/Typography.style";

export const lightModePrimary = "yellow.700";
export const darkModePrimary = "purple.700";
export const darkModeSecondary = "magenta.50";

//@ts-ignore
export const darkModeGradient = `linear-gradient(0deg, ${Colors["purple"]["100"]} 0.03%, #FF3BEB 99.98%)`;

export type colorModeType = "light" | "dark";
export const lightOrDarkMode = (colorMode: colorModeType, ifLight: string, ifDark: string) => {
  return colorMode === "light" ? ifLight : ifDark;
};

// TODO: would be nice to limit the design system further
// https://github.com/chakra-ui/chakra-ui/issues/3931

// https://chakra-ui.com/docs/theming/customize-theme
const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
  styles: {
    global: ({ colorMode }: { colorMode: colorModeType }) => ({
      html: {
        bg: lightOrDarkMode(colorMode, "yellow.50", darkModePrimary),
        color: "fuchsia",
      },
      body: {
        color: "fuchsia",
        bg: lightOrDarkMode(colorMode, "yellow.50", darkModePrimary),
      },
      "::-webkit-scrollbar": {
        width: "8px",
        height: "8px",
      },
      "::-webkit-scrollbar-track": {
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: lightOrDarkMode(colorMode, "black", "white"),
        borderRadius: "8px",
      },
      "::-webkit-scrollbar-thumb": {
        backgroundColor: lightOrDarkMode(colorMode, "black", "white"),
        borderRadius: "8px",
      },
      "::-webkit-scrollbar-corner": {
        backgroundColor: lightOrDarkMode(colorMode, "yellow.50", darkModePrimary),
      },
    }),
  },
  breakpoints: {
    sm: "320px", // 320px -> 480px mobile
    md: "768px", // 481px -> 768px tablets
    lg: "960px", // 769px -> 1024 small laptops
    xl: "1200px", // 1025px -> 1200px desktops
    "2xl": "1536px", // extra large screens (tvs)
  },
  colors: Colors,
  components: {
    Button: ButtonStyle,
    Select: SelectStyle,
    Menu: MenuStyle,
    Text: TypographyStyle,
    Input: InputStyle,
    NumberInput: NumberInputStyle,
    Tag: TagStyle,
    Demo: DemoStyle,
    Pane: PaneStyle,
    Toast: ToastStyle,
    ColorModeToggle: ColorModeToggleStyle,
    Icon: IconStyle,
    Modal: ModalStyle,
    Loading: LoadingStyle,
    PixelPane: PixelPaneStyle,
    Pill: PillStyle,
    Link: LinkStyle,
    Checkbox: CheckboxStyle,
    BigText: BigTextStyle,
    Drawer: DrawerStyle,
    Tooltip: TooltipStyle,
    Typeahead: TypeaheadStyle,
  },
});

export default theme;

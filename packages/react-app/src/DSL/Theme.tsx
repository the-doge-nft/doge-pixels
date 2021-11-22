import { extendTheme } from "@chakra-ui/react";
import ButtonStyle from "./Button/Button.styles";
import SelectStyle from "./Form/Select/Select.style";
import MenuStyle from "./Menu/Menu.style";
import TypographyStyle from "./Typography/Typography.style";
import InputStyle from "./Form/Input/Input.style";
import TagStyle from "./Tag/Tag.styles";
import NumberInputStyle from "./Form/NumberInput/NumberInput.style";
import ModalStyle from "./Modal/Modal.style";
import DemoStyle from "./Demo/Demo.style";
import Colors from "./Colors/Colors";
import PaneStyle from "./Pane/Pane.styles";
import ToastStyle from "./Toast/Toast.style";
import ColorModeToggleStyle from "./ColorModeToggle/ColorModeToggle.style";
import IconStyle from "./Icon/Icon.style";
import NewModalStyle from "./Modal/NewModal.style";
import LoadingStyle from "./Loading/Loading.style";

export const darkModePrimary = "purple.700";

export type colorModeType = "light" | "dark";
export const lightOrDark = (colorMode: colorModeType, ifLight: string, ifDark: string) => {
  return colorMode === "light" ? ifLight : ifDark;
};

// TODO: would be nice to limit the design system further - tracking here
// https://github.com/chakra-ui/chakra-ui/issues/3931

// https://chakra-ui.com/docs/theming/customize-theme
const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
  styles: {
    global: ({ colorMode }: { colorMode: colorModeType }) => ({
      "html, body": {
        // detect what text is not intentionally themed
        color: "fuchsia",
        bg: lightOrDark(colorMode, "yellow.50", darkModePrimary),
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
    Tag: TagStyle,
    Modal: ModalStyle,
    Demo: DemoStyle,
    Pane: PaneStyle,
    Toast: ToastStyle,
    ColorModeToggle: ColorModeToggleStyle,
    Icon: IconStyle,
    NewModal: NewModalStyle,
    Loading: LoadingStyle
  },
});

export default theme;

import { Icon as ChakraIcon, IconProps as ChakraIconProps, useStyleConfig } from "@chakra-ui/react";
import { BsTwitter } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";
import { VscArrowRight, VscChevronDown, VscChevronUp } from "react-icons/vsc";

import Back from "./custom/Back";
import Close from "./custom/Close";
import Cowswap from "./custom/Cowswap";
import LooksRare from "./custom/LooksRare";
import OS from "./custom/OS";
import PixelMoon from "./custom/PixelMoon";
import PixelSun from "./custom/PixelSun";
import Search from "./custom/Search";
import TemplateToggle from "./custom/TemplateToggle";
import ToolErase from "./custom/ToolErase";
import ToolPen from "./custom/ToolPen";
import ToolStickers from "./custom/ToolStickers";
import User from "./custom/User";

export type ReactIconName = "chevron-up" | "chevron-down" | "arrow-right" | "discord" | "twitter";

type CustomIconName =
  | "person"
  | "search"
  | "sun"
  | "moon"
  | "close"
  | "back"
  | "cowswap"
  | "toolPen"
  | "toolErase"
  | "toolStickers"
  | "templateToggle"
  | "openSea"
  | "looksRare";

export type IconName = ReactIconName | CustomIconName;

const customIcons: CustomIconName[] = [
  "person",
  "search",
  "sun",
  "moon",
  "close",
  "back",
  "cowswap",
  "toolPen",
  "toolErase",
  "toolStickers",
  "templateToggle",
  "openSea",
  "looksRare",
];

const iconStringToComponentMap = {
  "chevron-up": VscChevronUp,
  "chevron-down": VscChevronDown,
  "arrow-right": VscArrowRight,
  discord: FaDiscord,
  twitter: BsTwitter,
};

const customIconStringToComponentMap = {
  person: User,
  search: Search,
  sun: PixelSun,
  moon: PixelMoon,
  close: Close,
  back: Back,
  cowswap: Cowswap,
  toolPen: ToolPen,
  toolErase: ToolErase,
  toolStickers: ToolStickers,
  templateToggle: TemplateToggle,
  openSea: OS,
  looksRare: LooksRare,
};

interface IconProps extends ChakraIconProps {
  icon: IconName;
}

const Icon = ({ icon, ...rest }: IconProps) => {
  const style = useStyleConfig("Icon");
  if (customIcons.includes(icon as CustomIconName)) {
    const Component = customIconStringToComponentMap[icon as CustomIconName];
    return <Component __css={style} {...rest} />;
  } else {
    //@ts-ignore
    return <ChakraIcon __css={style} as={iconStringToComponentMap[icon as ReactIconName]} {...rest} />;
  }
};

export default Icon;

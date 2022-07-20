import React from "react";
import {Icon as ChakraIcon, IconProps as ChakraIconProps, useStyleConfig} from "@chakra-ui/react";
import {VscArrowRight, VscChevronDown, VscChevronUp} from "react-icons/all";

import User from "./custom/User";
import Search from "./custom/Search";
import PixelSun from "./custom/PixelSun";
import PixelMoon from "./custom/PixelMoon";
import Close from "./custom/Close";
import Back from "./custom/Back";

export type ReactIconName =
  | "chevron-up"
  | "chevron-down"
  | "arrow-right"

type CustomIconName =
  | "person"
  | "search"
  | "sun"
  | "moon"
  | "close"
  | "back"

const customIcons: CustomIconName[] = ['person', 'search', 'sun', 'moon', 'close', 'back']

const iconStringToComponentMap = {
  "chevron-up": VscChevronUp,
  "chevron-down": VscChevronDown,
  "arrow-right": VscArrowRight
};

const customIconStringToComponentMap = {
  person: User,
  search: Search,
  sun: PixelSun,
  moon: PixelMoon,
  close: Close,
  back: Back
}

interface IconProps extends ChakraIconProps {
  icon: ReactIconName | CustomIconName;
}

const Icon = ({ icon, ...rest }: IconProps) => {
  const style = useStyleConfig("Icon")
  if (customIcons.includes(icon as CustomIconName)) {
    const Component = customIconStringToComponentMap[icon as CustomIconName]
    return <Component __css={style} {...rest}/>
  } else {
    //@ts-ignore
    return <ChakraIcon __css={style} as={iconStringToComponentMap[icon as ReactIconName]} {...rest} />;
  }
};

export default Icon;

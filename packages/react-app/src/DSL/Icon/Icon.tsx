import React from "react";
import {Icon as ChakraIcon, IconProps as ChakraIconProps, useStyleConfig, Image} from "@chakra-ui/react";
import {
  CgClose,
  FiArrowDown,
  FiArrowDownRight,
  IoWallet,
  FiCheckCircle,
  FiCheck,
  FiArrowUpLeft,
  BsArrowLeftRight,
  FaMoneyBillWaveAlt,
  FiRefreshCcw,
  TiWarning,
  GoEye,
  GoEyeClosed,
  BsSunFill,
  BsMoonFill,
  VscChevronDown,
  VscChevronUp,
  HiArrowLeft
} from "react-icons/all";

import User from "./custom/User";
import Search from "./custom/Search";

export type ReactIconName =
  | "arrow-right-down"
  | "arrow-left"
  | "close"
  | "wallet"
  | "arrow-down"
  | "check-circle"
  | "check"
  | "exchange"
  | "arrow-up-left"
  | "money"
  | "refresh"
  | "warning"
  | "eye-open"
  | "eye-closed"
  | "sun"
  | "moon"
  | "chevron-up"
  | "chevron-down";

type CustomIconName =
  | "person"
  | "search";

const customIcons: CustomIconName[] = ['person', 'search']

const iconStringToComponentMap = {
  "arrow-right-down": FiArrowDownRight,
  close: CgClose,
  wallet: IoWallet,
  "arrow-down": FiArrowDown,
  "check-circle": FiCheckCircle,
  check: FiCheck,
  exchange: BsArrowLeftRight,
  "arrow-up-left": FiArrowUpLeft,
  money: FaMoneyBillWaveAlt,
  refresh: FiRefreshCcw,
  "arrow-left": HiArrowLeft,
  warning: TiWarning,
  "eye-open": GoEye,
  "eye-closed": GoEyeClosed,
  sun: BsSunFill,
  moon: BsMoonFill,
  "chevron-up": VscChevronUp,
  "chevron-down": VscChevronDown,
};

const customIconStringToComponentMap = {
  person: User,
  search: Search
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

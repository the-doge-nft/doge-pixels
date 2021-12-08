import React from "react";
import {Icon as ChakraIcon, IconProps as ChakraIconProps, useStyleConfig, Image} from "@chakra-ui/react";
import {
  CgClose,
  FiArrowDown,
  FiArrowDownRight,
  FiArrowLeft,
  IoWallet,
  FiCheckCircle,
  FiCheck,
  FaExchangeAlt,
  FiArrowUpLeft,
  BsArrowLeftRight,
  FaMoneyBillWaveAlt,
  FiRefreshCcw,
  IoMdPerson,
  TiWarning,
  GoEye,
  GoEyeClosed,
  BsSunFill,
  BsMoonFill,
  VscChevronDown,
  VscChevronUp
} from "react-icons/all";
import LeftArrow from "../../images/LeftArrow.svg";
import User from "../../images/User.svg";
import Search from "../../images/Search.svg";

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
  "arrow-left"
  | "person"
  | "search";

const customIcons: CustomIconName[] = ['arrow-left', 'person', 'search']

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
  // person: User,
  warning: TiWarning,
  "eye-open": GoEye,
  "eye-closed": GoEyeClosed,
  sun: BsSunFill,
  moon: BsMoonFill,
  "chevron-up": VscChevronUp,
  "chevron-down": VscChevronDown,
  search: Search
};

const customIconStringToComponentMap = {
  person: User,
  "arrow-left": LeftArrow,
  search: Search
}

interface IconProps extends ChakraIconProps {
  icon: ReactIconName | CustomIconName;
}

const Icon = ({ icon, ...rest }: IconProps) => {
  const style = useStyleConfig("Icon")
  if (customIcons.includes(icon as CustomIconName)) {
    //@ts-ignore
    return <Image __css={style} src={customIconStringToComponentMap[icon as CustomIconName]} {...rest}/>
  } else {
    //@ts-ignore
    return <ChakraIcon __css={style} as={iconStringToComponentMap[icon as ReactIconName]} {...rest} />;
  }
};

export default Icon;

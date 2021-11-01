import React from "react";
import { Icon as ChakraIcon, IconProps as ChakraIconProps } from "@chakra-ui/react";
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
} from "react-icons/all";

export type IconName =
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
  | "person"
  | "warning"
  | "eye-open"
  | "eye-closed"
  | "sun"
  | "moon";

const iconStringToComponentMap = {
  "arrow-right-down": FiArrowDownRight,
  "arrow-left": FiArrowLeft,
  close: CgClose,
  wallet: IoWallet,
  "arrow-down": FiArrowDown,
  "check-circle": FiCheckCircle,
  check: FiCheck,
  exchange: BsArrowLeftRight,
  "arrow-up-left": FiArrowUpLeft,
  money: FaMoneyBillWaveAlt,
  refresh: FiRefreshCcw,
  person: IoMdPerson,
  warning: TiWarning,
  "eye-open": GoEye,
  "eye-closed": GoEyeClosed,
  sun: BsSunFill,
  moon: BsMoonFill,
};

interface IconProps extends ChakraIconProps {
  icon: IconName;
}

const Icon = ({ icon, ...rest }: IconProps) => {
  return <ChakraIcon as={iconStringToComponentMap[icon]} {...rest} />;
};

export default Icon;

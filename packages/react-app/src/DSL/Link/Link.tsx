import React from "react";
import { Link as ChakraLink, LinkProps as ChakraLinkProps, useStyleConfig } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Type } from "../Fonts/Fonts";

interface LinkProps extends ChakraLinkProps {
  to?: any;
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
  isNav?: boolean;
  variant?: Type;
}

const NavLink = ({ to, ...rest }: LinkProps) => {
  return (
    <ChakraLink to={to} {...rest} as={ReactRouterLink}>
      {rest.children}
    </ChakraLink>
  );
};

const NormalLink = ({ ...rest }: LinkProps) => {
  return <ChakraLink {...rest}>{rest.children}</ChakraLink>;
};

const Link = ({ isNav, variant = Type.PresStart, size = "md", to, ...rest }: LinkProps) => {
  const styles = useStyleConfig("Link", { variant, size });
  const fontSize = styles.fontSize as string;
  if (isNav) {
    return <NavLink to={to} fontSize={fontSize} variant={variant} __css={styles} {...rest} />;
  } else {
    return <NormalLink href={to} fontSize={fontSize} variant={variant} __css={styles} {...rest} />;
  }
};

export default Link;

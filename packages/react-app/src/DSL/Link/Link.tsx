import React from "react";
import {Link as ChakraLink, LinkProps as ChakraLinkProps, useStyleConfig} from "@chakra-ui/react";
import {Link as ReactRouterLink} from "react-router-dom";
import {Type} from "../Fonts/Fonts";


interface LinkProps extends ChakraLinkProps {
  to?: any;
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
  isNav?: boolean;
  variant?: Type
}

const NavLink = ({to, ...rest}: LinkProps) => {
  return <ChakraLink to={to} {...rest} as={ReactRouterLink}>
      {rest.children}
  </ChakraLink>
}

const NormalLink = ({...rest}: LinkProps) => {
  return <ChakraLink {...rest}>
      {rest.children}
  </ChakraLink>
}

const Link = ({isNav, variant = Type.PresStart, size = "md", ...rest}: LinkProps) => {
  const styles = useStyleConfig('Link', {variant, size})
  const fontSize = styles.fontSize as string
  if (isNav) {
    return <NavLink fontSize={fontSize} variant={variant} {...rest} __css={styles}/>
  } else {
    return <NormalLink fontSize={fontSize} variant={variant} {...rest} __css={styles}/>
  }
}

export default Link;

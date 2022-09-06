import React from "react";
import { Icon } from "@chakra-ui/react";
import { IconProps as ChakraIconProps } from "@chakra-ui/react";

const SearchIcon = ({ ...rest }: ChakraIconProps) => {
  return (
    <Icon {...rest}>
      {/*<svg width="25" height="24" viewBox="0 0 25 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">*/}
      <g clipPath="url(#clip0_524_5453)">
        <path d="M16.444 2.66666H13.7773V5.33332H16.444V2.66666Z" fill="currentColor" />
        <path
          d="M16.4443 10.6667V13.3333H19.111V10.6667V8.00001V5.33334H16.4443V8.00001V10.6667Z"
          fill="currentColor"
        />
        <path d="M16.444 13.3333H13.7773V16H16.444V13.3333Z" fill="currentColor" />
        <path d="M19.111 16H16.4443V18.6667H19.111V16Z" fill="currentColor" />
        <path d="M21.778 18.6667H19.1113V21.3333H21.778V18.6667Z" fill="currentColor" />
        <path d="M24.444 21.3333H21.7773V24H24.444V21.3333Z" fill="currentColor" />
        <path d="M3.111 8.00001V5.33334H0.444336V8.00001V10.6667V13.3333H3.111V10.6667V8.00001Z" fill="currentColor" />
        <path d="M5.778 13.3333H3.11133V16H5.778V13.3333Z" fill="currentColor" />
        <path d="M11.1107 2.66667H13.7773V0H11.1107H8.44401H5.77734V2.66667H8.44401H11.1107Z" fill="currentColor" />
        <path d="M8.44401 16H5.77734V18.6667H8.44401H11.1107H13.7773V16H11.1107H8.44401Z" fill="currentColor" />
        <path d="M5.778 2.66666H3.11133V5.33332H5.778V2.66666Z" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="clip0_524_5453">
          <rect width="24" height="24" fill="currentColor" transform="translate(0.444336)" />
        </clipPath>
      </defs>
      {/*</svg>*/}
    </Icon>
  );
};

export default SearchIcon;

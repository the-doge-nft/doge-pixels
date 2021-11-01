import { Global } from "@emotion/react";
//@ts-ignore
import ComicSans from "./ComicSansMS.woff2";
import React from "react";

const Fonts = () => {
  return (
    <Global
      styles={`
            @font-face {
                font-family: 'Comic Sans';
                font-style: 'normal';
                font-weight: '400';
                src: url(${ComicSans}) format('woff2');
            }
        `}
    />
  );
};

export default Fonts;

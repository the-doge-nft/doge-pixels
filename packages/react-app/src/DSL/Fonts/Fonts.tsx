import { Global } from "@emotion/react";
import ComicSans from "./ComicSansMS.woff2";
import PressStart from "./PressStart2P-Regular.ttf";
import React from "react";

export enum Type {
  PresStart = "PressStart2P",
  ComicSans = "Comic Sans",
}

const Fonts = () => {
  return (
    <Global
      styles={`
            @font-face {
                font-family: '${Type.PresStart}';
                font-style: 'normal';
                font-weight: '400';
                src: url(${PressStart}) format('woff2');
            }
              @font-face {
                font-family: '${Type.ComicSans}';
                font-style: 'normal';
                font-weight: '400';
                src: url(${ComicSans}) format('woff2');
            }
        `}
    />
  );
};

export default Fonts;

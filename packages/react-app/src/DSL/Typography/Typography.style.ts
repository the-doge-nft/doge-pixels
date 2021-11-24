import { Type } from "../Fonts/Fonts";

export const GlobalFont = `${Type.PresStart}, sans-serif`;

const TypographyStyle = {
  baseStyle: ({ colorMode }: { colorMode: "light" | "dark" }) => ({
    fontFamily: GlobalFont,
    color: colorMode === "light" ? "black" : "white",
    textDecorationColor: colorMode === "light" ? "black" : "white",
  }),
  variants: {
    PresStart10: {
      fontFamily: Type.PresStart,
      fontWeight: "normal",
      fontSize: "10px",
    },
    PresStart12: {
      fontFamily: Type.PresStart,
      fontWeight: "normal",
      fontSize: "12px",
    },
    PresStart14: {
      fontFamily: Type.PresStart,
      fontWeight: "normal",
      fontSize: "14px",
    },
    PresStart15: {
      fontFamily: Type.PresStart,
      fontWeight: "normal",
      fontSize: "15px",
    },
    PresStart16: {
      fontFamily: Type.PresStart,
      fontWeight: "normal",
      fontSize: "16px",
    },
    PresStart18: {
      fontFamily: Type.PresStart,
      fontWeight: "normal",
      fontSize: "18px",
    },
    PresStart20: {
      fontFamily: Type.PresStart,
      fontWeight: "normal",
      fontSize: "20px",
    },
    PresStart22: {
      fontFamily: Type.PresStart,
      fontWeight: "normal",
      fontSize: "22px",
    },
    PresStart24: {
      fontFamily: Type.PresStart,
      fontWeight: "normal",
      fontSize: "24px",
    },
    PresStart28: {
      fontFamily: Type.PresStart,
      fontWeight: "normal",
      fontSize: "28px",
    },
    PresStart30: {
      fontFamily: Type.PresStart,
      fontWeight: "normal",
      fontSize: "30px",
    },
    PresStart45: {
      fontFamily: Type.PresStart,
      fontWeight: "normal",
      fontSize: "45px",
    },
    ComicSans10: {
      fontFamily: Type.ComicSans,
      fontWeight: "normal",
      fontSize: "10px"
    },
    ComicSans12: {
      fontFamily: Type.ComicSans,
      fontWeight: "normal",
      fontSize: "12px",
    },
    ComicSans14: {
      fontFamily: Type.ComicSans,
      fontWeight: "normal",
      fontSize: "14px",
    },
    ComicSans16: {
      fontFamily: Type.ComicSans,
      fontWeight: "normal",
      fontSize: "16px",
    },
    ComicSans18: {
      fontFamily: Type.ComicSans,
      fontWeight: "normal",
      fontSize: "18px",
    },
    ComicSans20: {
      fontFamily: Type.ComicSans,
      fontWeight: "normal",
      fontSize: "20px",
    },
    ComicSans22: {
      fontFamily: Type.ComicSans,
      fontWeight: "normal",
      fontSize: "22px",
    },
    ComicSans28: {
      fontFamily: Type.ComicSans,
      fontWeight: "normal",
      fontSize: "28px",
    },
  },
};

export default TypographyStyle;

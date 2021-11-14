import { Type } from "../Fonts/Fonts";

export const GlobalFont = `${Type.PresStart2P}, sans-serif`;

const TypographyStyle = {
  baseStyle: ({ colorMode }: { colorMode: "light" | "dark" }) => ({
    fontFamily: GlobalFont,
    color: colorMode === "light" ? "black" : "white",
    textDecorationColor: colorMode === "light" ? "black" : "white",
  }),
  variants: {
    Detail12: {
      fontWeight: "normal",
      fontSize: "12px",
    },
    Detail14: {
      fontWeight: "normal",
      fontSize: "14px",
    },
    Detail16: {
      fontWeight: "normal",
      fontSize: "16px",
    },
    Body12: {
      fontWeight: "normal",
      fontSize: "12px",
    },
    Body14: {
      fontWeight: "normal",
      fontSize: "14px",
    },
    Body16: {
      fontWeight: "normal",
      fontSize: "16px",
    },
    Body18: {
      fontWeight: "normal",
      fontSize: "18px",
    },
    Body20: {
      fontWeight: "normal",
      fontSize: "20px",
    },
    Title22: {
      fontWeight: "normal",
      fontSize: "22px",
    },
    Title28: {
      fontWeight: "normal",
      fontSize: "28px",
    },
    Title45: {
      fontWeight: "normal",
      fontSize: "45px",
    },
  },
};

export default TypographyStyle;

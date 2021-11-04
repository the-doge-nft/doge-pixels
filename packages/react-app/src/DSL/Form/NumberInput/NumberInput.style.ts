import { GlobalFont } from "../../Typography/Typography.style";
import { darkModePrimary } from "../../Theme";

export const NumberInputStyle = {
  parts: ["root", "field", "stepperGroup", "stepper"],
  baseStyle: ({ colorMode }: { colorMode: "light" | "dark" }) => ({
    field: {
      fontFamily: GlobalFont,
      _disabled: {
        bg: "pink.500",
      },
      bg: colorMode === "light" ? "white" : darkModePrimary,
      color: colorMode === "light" ? "black" : "white",
      borderWidth: '3px',
      borderStyle: 'solid',
      borderColor: colorMode === "light" ? "black" : "white",
      // borderRadius: "3px",
    },
    stepper: {
      borderColor: colorMode === "light" ? "black" : "white",
      borderWidth: "2px"
    }
  }),
  variants: ({colorMode}: {colorMode: "light" | "dark"}) => ({
    gray: {
      field: {
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: colorMode === "light" ? "black" : "white",
        borderRadius: '3px'
      },
    },
  }),
  defaultProps: {
    variant: "gray",
  },
};

export default NumberInputStyle;

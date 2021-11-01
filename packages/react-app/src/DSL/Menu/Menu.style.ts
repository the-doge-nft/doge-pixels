const MenuStyle = {
  parts: ["item", "list"],
  baseStyle: {
    item: {
      color: "black",
      bg: "white",
      fontWeight: "normal",
      fontSize: "14px",
      fontFamily: "Basier Circle",
      _hover: {
        fontWeight: "semibold",
        bg: "white",
      },
      _active: {
        fontWeight: "semibold",
        bg: "white",
      },
      _focus: {
        bg: "white",
      },
    },
    list: {
      border: "1px solid",
      borderColor: "gray.50",
    },
  },
  variants: {},
  defaultProps: {},
};

export default MenuStyle;

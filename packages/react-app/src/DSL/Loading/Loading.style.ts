import { colorModeType, lightOrDark } from "../Theme";

const LoadingStyle = {
    baseStyle: ({colorMode}: {colorMode: colorModeType}) => ({
        p: "6px",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        maxWidth: "300px",
        w: "100%",
        h: "50px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: lightOrDark(colorMode, "black", "white")
    })
}

export default LoadingStyle;

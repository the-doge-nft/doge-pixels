import {colorModeType, darkModeGradient, lightOrDark} from "../Theme";

const LoadingStyle = {
    parts: ["container", "pixel"],
    baseStyle: ({colorMode}: {colorMode: colorModeType}) => ({
        container: {
            p: "6px",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            maxWidth: "300px",
            w: "100%",
            h: "50px",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: lightOrDark(colorMode, "black", "white"),
        },
        pixel: {
            bg: lightOrDark(colorMode, "none", darkModeGradient),
            mr: 2,
            display: "inline-block",
            height: "100%",
            width: "20px",
            flexShrink: 0
        }
    })
}

export default LoadingStyle;

import {colorModeType, darkModePrimary} from "../Theme";

const ToastStyle = {
    baseStyle: {
        borderStyle: "solid",
        borderWidth: "2px",
        color: "black"
    },
    variants: {
        success: {
            bg: "white"
        },
        debug: {
            bg: "yellow.100"
        }
    },
}

export default ToastStyle

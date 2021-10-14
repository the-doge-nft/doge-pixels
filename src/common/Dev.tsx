import React from "react";
import {isDevModeEnabled} from "../environment/helpers";

interface DevProps {
    children: JSX.Element
}

const Dev = ({children}: DevProps) => {
    if (isDevModeEnabled()) {
        return <>
            {children}
        </>
    } else {
        return <></>
    }
}

export default Dev

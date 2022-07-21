import React from "react";
import { isDevModeEnabled } from "../environment/helpers";


const Dev: React.FC<any> = ({ children }) => {
  if (isDevModeEnabled()) {
    return <>{children && children}</>;
  } else {
    return <></>;
  }
};

export default Dev;

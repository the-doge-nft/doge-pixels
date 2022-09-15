import React from "react";
import { isDevModeEnabled, isStaging } from "../environment/helpers";

const Dev: React.FC<any> = ({ children }) => {
  if (isDevModeEnabled() || isStaging()) {
    return <>{children && children}</>;
  } else {
    return <></>;
  }
};

export default Dev;

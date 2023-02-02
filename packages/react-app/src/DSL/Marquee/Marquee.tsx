import React, { PropsWithChildren } from "react";
import RFM from "react-fast-marquee";

interface MarqueProps {
  pauseOnHover?: boolean;
  pauseOnClick?: boolean;
  direction?: "left" | "right";
  speed?: number;
  loop?: number;
}

const Marquee: React.FC<PropsWithChildren<MarqueProps>> = ({ children, ...rest }) => {
  return (
    <RFM gradient={false} {...rest}>
      {children}
    </RFM>
  );
};

export default Marquee;

import { Box, Flex } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import styles from "./Marquee.module.css";

interface MarqueProps {}

const Marquee: React.FC<PropsWithChildren<MarqueProps>> = ({ children }) => {
  return (
    <Box overflowX={"hidden"} position={"relative"} transform={"translateZ(0)"}>
      <Flex position={"relative"} className={styles["scroll-left"]}>
        {children}
      </Flex>
    </Box>
  );
};

export default Marquee;

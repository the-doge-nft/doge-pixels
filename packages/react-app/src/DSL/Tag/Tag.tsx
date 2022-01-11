import { Box, Flex, useStyleConfig } from "@chakra-ui/react";
import React from "react";
import Typography, { TVariant } from "../Typography/Typography";
import { AllowedStyleProps } from "../Form/interfaces";

type TagColors = "orange" | "red" | "green" | "yellow" | "purple" | "gray" | "pink";

interface TagProps extends AllowedStyleProps {
  variant: TagColors;
  children: string;
}

const Tag = ({ variant, children, ...rest }: TagProps) => {
  const styles = useStyleConfig("Tag", { variant });
  return (
    <Flex borderRadius={5} alignItems={"center"} px={2} py={1} as={"span"} display={"inline"} {...rest} __css={styles}>
      <Typography variant={TVariant.ComicSans14}>{children}</Typography>
    </Flex>
  );
};

export default Tag;

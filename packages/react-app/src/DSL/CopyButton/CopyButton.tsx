import React from "react";
import { observer } from "mobx-react-lite";
import copyToClipboard from "../../helpers/clipboard";
import Typography, { TVariant } from "../Typography/Typography";
import { Box } from "@chakra-ui/react";

interface CopyButtonProps {
  children: any;
  toCopy: string;
}

const CopyButton = observer(({ children, toCopy }: CopyButtonProps) => {
  return (
    <Box
      py={1}
      px={2}
      bg={"gray.50"}
      borderRadius={9}
      _hover={{ cursor: "pointer", bg: "gray.100" }}
      onClick={() => copyToClipboard(toCopy)}
      maxWidth={"150px"}
      whiteSpace={"nowrap"}
      overflow={"hidden"}
      textOverflow={"ellipsis"}
    >
      {children && children}
    </Box>
  );
});

export default CopyButton;

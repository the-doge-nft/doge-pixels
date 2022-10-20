import { Box } from "@chakra-ui/react";
import { useState } from "react";
import Button from "../Button/Button";
import Demo from "../Demo/Demo";
import Typography, { TVariant } from "../Typography/Typography";
import BottomSheet from "./BottomSheet";

const BottomSheetDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Demo title={"Bottom Sheet"}>
      <Button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Close" : "Open"}</Button>
      <BottomSheet
        snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight / 2]}
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
      >
        <Box p={4}>
          <Typography variant={TVariant.ComicSans18}>wow check out this drawer!</Typography>
        </Box>
      </BottomSheet>
    </Demo>
  );
};

export default BottomSheetDemo;

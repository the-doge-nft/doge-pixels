import { observer } from "mobx-react-lite";
import LeaderborkStore from "./Leaderbork.store";
import { convertToAbbreviation } from "../../helpers/numberFormatter";
import Pane from "../../DSL/Pane/Pane";
import { Box, Flex } from "@chakra-ui/react";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import BigText from "../../DSL/BigText/BigText";
import React from "react";
import AppStore from "../../store/App.store";

const DogLocked = observer(({ dogLocked }: { dogLocked?: number }) => {
  const [num, abbr] = dogLocked ? convertToAbbreviation(Math.trunc(dogLocked)) : ["N/A", ""];
  return (
    <Pane h={"inherit"}>
      <Flex flexDirection={"column"}>
        <Flex mb={4} alignItems={"flex-end"}>
          <Typography variant={TVariant.PresStart18} block height={"max-content"}>
            DOG Locked
          </Typography>
        </Flex>
        <Flex flexGrow={1} alignItems={"center"}>
          <Box>
            <BigText size={AppStore.rwd.isMobile ? "sm" : "md"} label={abbr}>
              {num}
            </BigText>
          </Box>
        </Flex>
      </Flex>
    </Pane>
  );
});

export default DogLocked;

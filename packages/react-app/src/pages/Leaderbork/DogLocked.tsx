import { Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import BigText from "../../DSL/BigText/BigText";
import Pane from "../../DSL/Pane/Pane";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { convertToAbbreviation } from "../../helpers/numberFormatter";
import AppStore from "../../store/App.store";

const DogLocked = observer(({ dogLocked }: { dogLocked?: number }) => {
  const [num, abbr] = dogLocked ? convertToAbbreviation(Math.trunc(dogLocked)) : ["", ""];
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

import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import BigText from "../../DSL/BigText/BigText";
import Pane from "../../DSL/Pane/Pane";
import { lightOrDarkMode } from "../../DSL/Theme";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { convertToAbbreviation, formatPercentageTwoDecimals } from "../../helpers/numberFormatter";
import AppStore from "../../store/App.store";
import LeaderborkStore from "./Leaderbork.store";

const DogLocked = observer(({ store }: { store: LeaderborkStore }) => {
  const [num, abbr] = store.lockedDog ? convertToAbbreviation(Math.trunc(store.lockedDog)) : ["", ""];
  const { colorMode } = useColorMode();
  return (
    <Pane h={"inherit"}>
      <Flex flexDirection={"column"}>
        <Flex mb={4} alignItems={"flex-end"}>
          <Typography variant={TVariant.PresStart18} block height={"max-content"}>
            DOG Locked
          </Typography>
        </Flex>
        <Flex flexGrow={1} alignItems={"flex-end"}>
          <Box>
            <BigText size={AppStore.rwd.isMobile ? "sm" : "md"} label={abbr}>
              {num}
            </BigText>
          </Box>
          {store.percentageLocked && (
            <Typography
              ml={4}
              mb={{ base: 1, md: 4 }}
              color={lightOrDarkMode(colorMode, "yellow.100", "gray.300")}
              variant={TVariant.PresStart12}
            >
              {formatPercentageTwoDecimals(store.percentageLocked)} supply
            </Typography>
          )}
        </Flex>
      </Flex>
    </Pane>
  );
});

export default DogLocked;

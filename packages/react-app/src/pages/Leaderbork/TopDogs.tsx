import { observer } from "mobx-react-lite";
import LeaderborkStore from "./Leaderbork.store";
import { Box, Flex, useColorMode } from "@chakra-ui/react";
import Pane from "../../DSL/Pane/Pane";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { lightOrDarkMode } from "../../DSL/Theme";
import AppStore from "../../store/App.store";
import UserCard from "./UserCard";
import React from "react";

const TopDogs = observer(({ store }: { store: LeaderborkStore }) => {
  const { colorMode } = useColorMode();
  return (
    <Pane
      display={"flex"}
      flexDirection={"column"}
      title={
        <Flex alignItems={"center"}>
          <Typography variant={TVariant.PresStart18} block height={"max-content"}>
            Top Dogs
          </Typography>
          <Typography
            variant={TVariant.PresStart14}
            ml={3}
            height={"max-content"}
            block
            color={lightOrDarkMode(colorMode, "yellow.100", "gray.300")}
          >
            ({AppStore.web3.sortedPixelOwners.length})
          </Typography>
        </Flex>
      }
      h={{ xl: "full" }}
      maxH={{ base: "300px", lg: "full" }}
    >
      <Box overflowY={"auto"} flexGrow={1}>
        <Flex flexWrap={"wrap"} gap={1}>
          {AppStore.web3.sortedPixelOwners.map(owner => (
            <UserCard
              isSelected={store.selectedOwner && store.selectedOwner.address === owner.address}
              key={`top-dog-${owner.address}`}
              store={store}
              pixelOwner={owner}
            >
              {AppStore.web3?.address === owner.address && (
                <Typography
                  color={lightOrDarkMode(colorMode, "yellow.100", "gray.300")}
                  variant={TVariant.PresStart12}
                  ml={4}
                >
                  (you)
                </Typography>
              )}
            </UserCard>
          ))}
        </Flex>
      </Box>
    </Pane>
  );
});

export default TopDogs;

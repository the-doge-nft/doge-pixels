import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import InfiniteScroll from "../../DSL/InfiniteScroll/InfiniteScroll";
import Pane from "../../DSL/Pane/Pane";
import { lightOrDarkMode } from "../../DSL/Theme";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import AppStore from "../../store/App.store";
import LeaderborkStore from "./Leaderbork.store";
import UserCard from "./UserCard";

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
        <Flex flexWrap={"wrap"} gap={1} maxH={"350px"}>
          <InfiniteScroll
            next={() => store.page()}
            hasMore={store.hasMorePagableOwners}
            dataLength={store.paginableCount}
          >
            {store.pagableOwners.map(owner => (
              <UserCard
                key={`top-dog-${owner.address}`}
                isSelected={store.selectedOwner?.address === owner.address}
                onClick={address => store.setSelectedAddress(address)}
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
          </InfiniteScroll>
        </Flex>
      </Box>
    </Pane>
  );
});

export default TopDogs;

import { Box, Flex, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { PropsWithChildren } from "react";
import { darkModeSecondary, lightModePrimary, lightOrDarkMode } from "../../DSL/Theme";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import AppStore from "../../store/App.store";
import LeaderborkStore, { PixelOwnerInfo } from "./Leaderbork.store";
import PxPill from "./PxPill";

interface UserCardProps {
  store: LeaderborkStore;
  pixelOwner: PixelOwnerInfo;
  isSelected?: boolean;
}

const UserCard: React.FC<PropsWithChildren<UserCardProps>> = observer(
  ({ store, pixelOwner, isSelected = false, children }) => {
    const { colorMode } = useColorMode();
    return (
      <Flex
        w={"full"}
        justifyContent={"space-between"}
        alignItems={"center"}
        key={`${pixelOwner.address}`}
        px={2}
        py={1}
        _hover={{
          cursor: "pointer",
          bg: colorMode === "light" ? lightModePrimary : darkModeSecondary,
        }}
        onClick={() => store.setSelectedAddress(pixelOwner.address)}
      >
        <Flex alignItems={"center"} overflow={"hidden"}>
          <Box>
            <Typography
              variant={TVariant.PresStart12}
              block
              overflow={"hidden"}
              textOverflow={"ellipsis"}
              overflowWrap={"initial"}
              maxW={250}
            >
              {AppStore.web3.getAddressDisplayName(pixelOwner.address)}
            </Typography>
          </Box>
          {children}
        </Flex>
        <Box ml={4}>
          <PxPill
            bg={isSelected ? lightOrDarkMode(colorMode, "yellow.700", "magenta.50") : "transparent"}
            count={pixelOwner.pixels.length}
          />
        </Box>
      </Flex>
    );
  },
);

export default UserCard;

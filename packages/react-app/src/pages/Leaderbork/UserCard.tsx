import React, { PropsWithChildren } from "react";
import LeaderborkStore, { PixelOwnerInfo } from "./Leaderbork.store";
import {Box, Flex, useColorMode} from "@chakra-ui/react";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import {abbreviate} from "../../helpers/strings";
import PxPill from "./PxPill";
import { darkModeSecondary, lightModePrimary, lightOrDarkMode } from "../../DSL/Theme";
import {NamedRoutes, route} from "../../App.routes";
import { observer } from "mobx-react-lite";

interface UserCardProps {
  store: LeaderborkStore;
  pixelOwner: PixelOwnerInfo;
  isSelected?: boolean
}

const UserCard: React.FC<PropsWithChildren<UserCardProps>> = observer(({store, pixelOwner, isSelected = false, children}) => {
  const {colorMode} = useColorMode()
  return <Flex
    w={"full"}
    justifyContent={"space-between"}
    alignItems={"center"}
    key={`${pixelOwner.address}`}
    px={2}
    py={2}
    _hover={{
      cursor: "pointer",
      bg: colorMode === "light" ? lightModePrimary : darkModeSecondary
    }}
    onClick={() => store.selectOwner(pixelOwner.address)}
  >
    <Flex alignItems={"center"} overflow={"hidden"}>
      <Typography
        variant={TVariant.PresStart14}
        block
        overflow={"hidden"}
        textOverflow={"ellipsis"}
        overflowWrap={"initial"}
      >
        {pixelOwner.ens ? pixelOwner.ens : abbreviate(pixelOwner.address, 4)}
      </Typography>
      {children}
    </Flex>
    <Box ml={4}>
      <PxPill bg={isSelected ? lightOrDarkMode(colorMode, "yellow.700", "magenta.50") : "transparent"} count={pixelOwner.pixels.length} />
    </Box>
  </Flex>
})

export default UserCard;

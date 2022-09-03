import React from "react";
import DogParkPageStore, { PixelOwnerInfo } from "./DogParkPage.store";
import {Box, Flex, useColorMode} from "@chakra-ui/react";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import {abbreviate} from "../../helpers/strings";
import PxPill from "./PxPill";
import Icon from "../../DSL/Icon/Icon";
import {darkModeSecondary, lightModePrimary} from "../../DSL/Theme";
import {NamedRoutes, route} from "../../App.routes";

const UserCard = ({store, pixelOwner}: {store: DogParkPageStore, pixelOwner: PixelOwnerInfo }) => {
  const {colorMode} = useColorMode()

  return <Flex
    w={"full"}
    justifyContent={"space-between"}
    alignItems={"center"}
    key={`${pixelOwner.address}`}
    px={2}
    py={2}
    my={1}
    color={"black"}
    _hover={{
      cursor: "pointer",
      bg: colorMode === "light" ? lightModePrimary : darkModeSecondary
    }}
    onClick={() => {
      store.selectedAddress = pixelOwner.address
      store.addressToSearch = pixelOwner.address
      store.selectedPixel = null
      window.history.pushState({}, "", route(NamedRoutes.DOG_PARK, {address: store.selectedAddress}))
    }}
  >
    <Flex alignItems={"center"} overflow={"hidden"}>
      <Icon icon={'person'} display={"inline-block"} boxSize={5}/>
      <Typography
        variant={TVariant.PresStart14}
        ml={4}
        block
        overflow={"hidden"}
        textOverflow={"ellipsis"}
        overflowWrap={"initial"}
      >
        {pixelOwner.ens ? pixelOwner.ens : abbreviate(pixelOwner.address, 4)}
      </Typography>
    </Flex>
    <Box ml={4}>
      <PxPill count={pixelOwner.pixels.length} />
    </Box>
  </Flex>
}

export default UserCard;

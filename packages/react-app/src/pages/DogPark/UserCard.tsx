import React from "react";
import DogParkPageStore from "./DogParkPage.store";
import {Box, Flex, useColorMode} from "@chakra-ui/react";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import {abbreviate} from "../../helpers/strings";
import PxPill from "./PxPill";
import Icon from "../../DSL/Icon/Icon";
import {darkModeSecondary, lightModePrimary} from "../../DSL/Theme";
import {NamedRoutes, route} from "../../App.routes";

const UserCard = ({store, dog}: {store: DogParkPageStore, dog: { address: string, puppers: number[], ens?: string} }) => {
  const {colorMode} = useColorMode()

  return <Flex
    w={"full"}
    justifyContent={"space-between"}
    alignItems={"center"}
    key={`${dog.address}`}
    px={2}
    py={2}
    my={1}
    color={"black"}
    _hover={{
      cursor: "pointer",
      bg: colorMode === "light" ? lightModePrimary : darkModeSecondary
    }}
    onClick={() => {
      store.selectedAddress = dog.address
      store.addressToSearch = dog.address
      store.selectedPupper = null
      window.history.pushState({}, "", route(NamedRoutes.DOG_PARK, {address: store.selectedAddress}))
    }}
  >
    <Flex alignItems={"center"} overflow={"hidden"}>
      <Icon icon={'person'} display={"inline-block"} boxSize={5}/>
      <Typography
        variant={TVariant.PresStart15}
        ml={4}
        block
        overflow={"hidden"}
        textOverflow={"ellipsis"}
        overflowWrap={"initial"}
      >
        {dog.ens ? dog.ens : abbreviate(dog.address, 4)}
      </Typography>
    </Flex>
    <Box ml={4}>
      <PxPill count={dog.puppers.length} />
    </Box>
  </Flex>
}

export default UserCard;

import React from "react";
import DogParkPageStore from "./DogParkPage.store";
import {Box, Flex} from "@chakra-ui/react";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import {abbreviate} from "../../helpers/strings";
import AppStore from "../../store/App.store";
import PxPill from "./PxPill";
import Icon from "../../DSL/Icon/Icon";

const UserCard = ({store, dog}: {store: DogParkPageStore, dog: { address: string, puppers: number[], ens?: string} }) => {
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
      bg: "yellow.700"
    }}
    onClick={() => {
      store.selectedAddress = dog.address
      store.addressToSearch = dog.address
      store.selectedPupper = null
    }}
  >
    <Flex alignItems={"center"}>
      <Icon icon={'person'} display={"inline-block"}/>
      <Typography
        variant={TVariant.PresStart15}
        ml={4}
        block
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

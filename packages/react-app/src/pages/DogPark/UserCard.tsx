import React from "react";
import DogParkPageStore from "./DogParkPage.store";
import {Box, Flex} from "@chakra-ui/react";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import {abbreviate} from "../../helpers/strings";
import PxPill from "./PxPill";

const UserCard = ({store, dog}: {store: DogParkPageStore, dog: { address: string, puppers: number[]} }) => {
  return <Flex
    justifyContent={"space-between"}
    alignItems={"center"}
    key={`${dog.address}`}
    px={2}
    py={3}
    my={3}
    color={"black"}
    _hover={{
      cursor: "pointer",
      bg: "yellow.700"
    }}
    onClick={() => {
      store.selectedAddress = dog.address
      store.addressToSearch = dog.address
    }}
  >
    <Typography
      variant={TVariant.PresStart14}
      block
    >
      {abbreviate(dog.address, 4)}
    </Typography>
    <Box ml={4}>
      <PxPill count={dog.puppers.length} />
    </Box>
  </Flex>
}

export default UserCard;

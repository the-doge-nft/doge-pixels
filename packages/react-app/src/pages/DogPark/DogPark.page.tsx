import {Box, Flex, Grid, GridItem, useColorMode} from "@chakra-ui/react";
import {observer} from "mobx-react-lite";
import React, {useMemo} from "react";
import Pane from "../../DSL/Pane/Pane";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import DogParkPageStore from "./DogParkPage.store";
import TextInput from "../../DSL/Form/TextInput";
import Form from "../../DSL/Form/Form";
import model from "../../DSL/Form/model";
import {abbreviate} from "../../helpers/strings";
import {lightOrDark} from "../../DSL/Theme";
import PixelPane from "../../DSL/PixelPane/PixelPane";
import AppStore from "../../store/App.store";

const DogParkPage = observer(function DogParkPage() {
  const store = useMemo(() => new DogParkPageStore(), [])
  return <Grid templateColumns={"0.5fr 1fr"} mt={10} flexGrow={1}>
    <GridItem>
      <Pane display={"flex"} flexDirection={"column"} p={6} h={"full"}>
        <Typography variant={TVariant.PresStart24}>Top Dogs 🚀</Typography>
        <Box flexGrow={1} mt={4}>
          {store.topDogs.map((dog) => <DogCard store={store} dog={dog}/>)}
        </Box>
      </Pane>
    </GridItem>
    <GridItem ml={16}>
      <Box>
        <Form onSubmit={async () => console.log("test")}>
          <TextInput {...model(store, "addressToSearch")} placeholder={"Search pixel owners by address"}/>
        </Form>
        <Grid templateColumns={"1fr 1fr"} pt={4}>
          {!store.selectedAddress && <GridItem>
            {!store.isSearchInputEmpty && store.filteredDogs.length > 1 && <Typography
                mt={2}
                variant={TVariant.PresStart18}
                block
            >
                Similar results
            </Typography>}
            {!store.isSearchInputEmpty && store.filteredDogs.map(dog => <DogCard store={store} dog={dog}/>)}
            {!store.isSearchInputEmpty && store.isFilteredResultEmpty && <Typography
                variant={TVariant.PresStart14}>
                No results found
            </Typography>}
          </GridItem>}

          {store.selectedAddress && <>
              <GridItem display={"flex"} flexDirection={"column"}>
                <Box my={4}>
                  <Typography variant={TVariant.PresStart18}>
                    {abbreviate(store.selectedAddress)}
                  </Typography>
                    <Box ml={8} display={"inline-block"}>
                      <PxPill count={store.selectedDogs.puppers.length}/>
                    </Box>
                </Box>
                <Flex flexWrap={"wrap"}>
                  {store.selectedDogs.puppers.map(px => {
                    const hex = AppStore.web3.pupperToHexLocal(px)
                    const index = AppStore.web3.pupperToIndexLocal(px)
                    return <Box p={2}>
                      <PixelPane pupper={px} color={hex} pupperIndex={index}/>
                    </Box>
                  })}
                </Flex>
              </GridItem>
              <GridItem>
                <Typography variant={TVariant.PresStart18}>
                    test other stuff here
                </Typography>
              </GridItem>
          </>}
        </Grid>
      </Box>
    </GridItem>
  </Grid>
});

const DogCard = ({store, dog}: {store: DogParkPageStore, dog: { address: string, puppers: number[]} }) => {
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

const PxPill = ({count}: { count: number }) => {
  const {colorMode} = useColorMode()
  return <Box
    display={"inline-flex"}
    borderRadius={16}
    justifyContent={"space-between"}
    alignItems={"center"}
    borderWidth={"1px"}
    borderStyle={"solid"}
    borderColor={lightOrDark(colorMode, "black", "white")}
    minWidth={"100px"}
    px={"12px"}
    py={"6px"}
  >
    <Typography variant={TVariant.PresStart14}>{count}</Typography>
    <Typography variant={TVariant.PresStart14}>PX</Typography>
  </Box>
}

export default DogParkPage;

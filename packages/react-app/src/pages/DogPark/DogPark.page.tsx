import {Box, Flex, Grid, GridItem} from "@chakra-ui/react";
import {observer} from "mobx-react-lite";
import React, {useEffect, useMemo} from "react";
import Pane from "../../DSL/Pane/Pane";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import DogParkPageStore from "./DogParkPage.store";
import TextInput from "../../DSL/Form/TextInput";
import Form from "../../DSL/Form/Form";
import model from "../../DSL/Form/model";
import AppStore from "../../store/App.store";
import UserCard from "./UserCard";
import {useHistory, useParams} from "react-router-dom";
import Icon from "../../DSL/Icon/Icon";
import PxPill from "./PxPill";
import PixelPane from "../../DSL/PixelPane/PixelPane";
import Button from "../../DSL/Button/Button";

const DogParkPage = observer(function DogParkPage() {
  const history = useHistory()
  const { address, tokenID } = useParams<{address: string, tokenID: string}>()
  const store = useMemo(() => new DogParkPageStore(address, Number(tokenID)), [])
  useEffect(() => {

    AppStore.web3.getPupperOwnershipMap()

    if (AppStore.web3.web3Provider) {
      AppStore.web3.refreshDogBalance()
      AppStore.web3.refreshPupperBalance()
    }
  }, [])
  return <Grid templateColumns={"0.5fr 1fr"} flexGrow={1}>
    <GridItem>
      <Pane display={"flex"} flexDirection={"column"} h={"full"}>
        <Typography variant={TVariant.PresStart24}>Top Dogs 🚀</Typography>
        <Box flexGrow={1} mt={4}>
          {store.topDogs.map((dog) => <UserCard store={store} dog={dog}/>)}
        </Box>
      </Pane>
    </GridItem>
    <GridItem ml={16}>
      <Flex height={"100%"} flexDirection={"column"}>
        <Form onSubmit={async () => console.log("test")}>
          <TextInput {...model(store, "addressToSearch")} placeholder={"Search pixel owners by address"}/>
        </Form>
        <Grid templateColumns={"1fr 1fr"} my={4} flexGrow={1}>
          {!store.selectedAddress && <GridItem>
            {!store.isSearchInputEmpty && store.filteredDogs.length > 1 && <Typography
                mt={2}
                variant={TVariant.PresStart18}
                block
            >
                Similar results
            </Typography>}
            {!store.isSearchInputEmpty && !store.selectedAddress && store.filteredDogs.map(dog => <UserCard store={store} dog={dog}/>)}
            {!store.isSearchInputEmpty && store.isFilteredResultEmpty && <Typography
                variant={TVariant.PresStart14}>
                No results found
            </Typography>}
          </GridItem>}

          {store.selectedAddress && <>
              <GridItem display={"flex"} flexDirection={"column"} mt={6}>
                <Box>
                    <Flex alignItems={"center"}>
                      <Icon icon={'person'} boxSize={10}/>
                      <Typography variant={TVariant.PresStart18} ml={3}>
                        {store.selectedAddressDisplayName}
                      </Typography>
                      {store.isSelectedAddressAuthedUser && <Typography variant={TVariant.PresStart14} ml={3}>
                          (you)
                      </Typography>}
                    </Flex>

                  {store.selectedUserHasPuppers && <Box my={7}>
                        <PxPill count={store.selectedDogs?.puppers.length}/>
                  </Box>}
                  {!store.selectedUserHasPuppers && <Box mt={10} w={"full"} h={"full"}>
                      <Flex alignItems={"center"}>
                        <Typography variant={TVariant.PresStart28} color={"#d6ceb6"}>
                            No pixels owned
                        </Typography>
                        <Typography variant={TVariant.PresStart28} mb={2} ml={3}>
                            😟
                        </Typography>
                      </Flex>
                  </Box>}
                </Box>
                  <Box overflowY={"scroll"} flexGrow={1}>
                      <Flex flexWrap={"wrap"} maxHeight={"300px"}>
                        {store.selectedDogs?.puppers.map(px => {
                          const hex = AppStore.web3.pupperToHexLocal(px)
                          const index = AppStore.web3.pupperToIndexLocal(px)
                          return <Box
                            bg={store.selectedPupper === px ? "yellow.700" : "inherit"}
                            p={2}
                            m={1}
                            _hover={{bg: "yellow.700"}}
                          >
                            <PixelPane
                              key={`top_dog_${px}`}
                              size={"md"}
                              pupper={px}
                              color={hex}
                              pupperIndex={index}
                              onClick={(px) => store.selectedPupper = px}
                            />
                          </Box>
                        })}
                      </Flex>
                  </Box>
              </GridItem>
              <GridItem>
                {store.selectedPupper && <Box mt={10}>
                    <Flex flexDirection={"column"}>
                      <PixelPane
                        size={"lg"}
                        variant={"shadow"}
                        pupper={store.selectedPupper!}
                        color={store.selectedPupperHex}
                        pupperIndex={store.seletedPupperIndex}
                      />
                      <Box my={10}>
                        <Box>
                          <Typography variant={TVariant.ComicSans18}>HEX:</Typography>
                          <Typography variant={TVariant.ComicSans18} ml={2}>{store.selectedPupperHex}</Typography>
                        </Box>
                        <Box mt={1}>
                          <Typography variant={TVariant.ComicSans18}>Coordinates:</Typography>
                          <Typography variant={TVariant.ComicSans18} ml={2}>({store.selectedPupperCoords[0]},{store.selectedPupperCoords[1]})</Typography>
                        </Box>
                      </Box>
                    </Flex>
                  <Button onClick={() => history.push(
                    `/?x=${store.selectedPupperCoords[0]}&y=${store.selectedPupperCoords[1]}`
                  )}>
                      View in portal
                  </Button>
                </Box>}
              </GridItem>
          </>}
        </Grid>
        <Box>
          <Pane h={"inherit"}>
            <Typography variant={TVariant.PresStart15}>DOG Locked</Typography>
          </Pane>
        </Box>
      </Flex>
    </GridItem>
  </Grid>
});

export default DogParkPage;

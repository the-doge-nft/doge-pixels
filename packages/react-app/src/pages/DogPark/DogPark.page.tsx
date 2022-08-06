import {Box, Flex, Grid, GridItem, useColorMode} from "@chakra-ui/react";
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
import {convertToAbbreviation} from "../../helpers/numberFormatter";
import BigText from "../../DSL/BigText/BigText";
import {darkModeSecondary, lightModePrimary} from "../../DSL/Theme";
import {NamedRoutes, route, SELECTED_PIXEL_PARAM} from "../../App.routes";

const DogParkPage = observer(function DogParkPage() {
  const history = useHistory()
  const { address, tokenID } = useParams<{address: string, tokenID: string}>()
  const store = useMemo(() => new DogParkPageStore(address, Number(tokenID)), [address, tokenID])
  const {colorMode} = useColorMode()

  useEffect(() => {
    if (AppStore.rwd.isMobile) {
      history.push(route(NamedRoutes.VIEWER))
    }
    // eslint-disable-next-line
  }, [AppStore.rwd.isMobile])

  useEffect(() => {
    store.init()
    // eslint-disable-next-line
  }, [])
  return <Grid templateColumns={"0.5fr 1fr"} flexGrow={1}>
    <GridItem display={"flex"} flexDirection={"column"} flexGrow={1}>
      <TopDogs store={store}/>
      <Box mt={8}>
        <DogKennel store={store}/>
      </Box>
    </GridItem>
    <GridItem ml={16}>
      <Flex height={"full"} flexDirection={"column"}>
        <Box mb={8}>
          <Form onSubmit={async () => {}}>
            <TextInput
              rightIcon={"search"}
              placeholder={"Search pixel owners by address"}
              {...model(store, "addressToSearch")}
            />
          </Form>
        </Box>

        <Flex flexDirection={"column"} flexGrow={1} h={"full"}>
          {!store.selectedAddress && <SearchHints store={store} />}
          {store.selectedAddress && <>
            <Box mb={5} h={store.selectedUserHasPuppers ? "initial" : "full"}>
              <Flex alignItems={"center"}>
                <Flex alignItems={"center"}>
                  <Icon icon={'person'} boxSize={6}/>
                  <Typography variant={TVariant.PresStart20} ml={3}>
                    {store.selectedAddressDisplayName}
                  </Typography>
                  {store.isSelectedAddressAuthedUser && <Typography variant={TVariant.PresStart15} ml={3}>
                      (you)
                  </Typography>}
                </Flex>
                <Box ml={4}>
                  <PxPill count={store.selectedUserHasPuppers ? store.selectedDogs?.puppers.length : 0}/>
                </Box>
              </Flex>
              {!store.selectedUserHasPuppers && <Box w={"full"} h={"full"}>
                  <Flex alignItems={"center"} w={"full"} h={"full"} justifyContent={"center"}>
                      <Typography variant={TVariant.PresStart28} color={"#d6ceb6"}>
                          No pixels owned
                      </Typography>
                      <Typography variant={TVariant.PresStart28} mb={2} ml={3}>
                          😟
                      </Typography>
                  </Flex>
              </Box>}
            </Box>

          {store.selectedUserHasPuppers && <Grid templateColumns={"1fr 1fr"} h={"full"}>
              <GridItem display={"flex"} flexDirection={"column"}>
                <Box overflowY={"auto"} flexGrow={1}>
                    <Flex flexWrap={"wrap"} maxHeight={"300px"}>
                      {store.selectedDogs?.puppers.map(px => {
                        const hex = AppStore.web3.pupperToHexLocal(px)
                        const index = AppStore.web3.pupperToIndexLocal(px)
                        return <Box
                          key={`user-dog-${px}`}
                          bg={store.selectedPupper === px
                            ? (colorMode === "light" ? lightModePrimary : darkModeSecondary)
                            : "inherit"}
                          p={2}
                          m={1}
                          mt={0}
                          _hover={{bg: (colorMode === "light" ? lightModePrimary : darkModeSecondary)}}
                        >
                          <PixelPane
                            size={"sm"}
                            key={`top_dog_${px}`}
                            pupper={px}
                            color={hex}
                            pupperIndex={index}
                            onClick={(px) => {
                              store.selectedPupper = px
                              window.history.pushState({}, "", route(NamedRoutes.DOG_PARK, {address: store.selectedAddress, tokenID: store.selectedPupper}))
                            }}
                          />
                        </Box>
                      })}
                    </Flex>
                </Box>
              </GridItem>
              <GridItem display={"flex"} justifyContent={"center"}>
                {store.selectedPupper && <Box maxWidth={"fit-content"}>
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
                  <Button onClick={() => history.push(route(NamedRoutes.PIXELS, {[SELECTED_PIXEL_PARAM]: store.selectedPupper}))}>
                      View in portal
                  </Button>
                </Box>}
              </GridItem>
          </Grid>}
          </>}

        </Flex>
      </Flex>
    </GridItem>
  </Grid>
});

const SearchHints = ({store}: {store: DogParkPageStore}) => {
  return <>
    {!store.isSearchInputEmpty && store.filteredDogs.length > 1 && <Typography
        mt={2}
        variant={TVariant.PresStart18}
        block
    >
        Similar results
    </Typography>}
    {!store.isSearchInputEmpty && !store.selectedAddress && store.filteredDogs.map(dog => <UserCard key={`filtered-dog-${dog.address}`} store={store} dog={dog}/>)}
    {!store.isSearchInputEmpty && store.isFilteredResultEmpty && <Typography
        variant={TVariant.PresStart15}>
        No results found
    </Typography>}
  </>
}

const DogKennel = observer(({store}: {store: DogParkPageStore}) => {
  const [num, abbr] = store.lockedDog ? convertToAbbreviation(Math.trunc(store.lockedDog)) : ["N/A", ""]
  return <Pane h={"inherit"}>
    <Flex flexDirection={"column"}>
      <Flex mb={6} alignItems={"flex-end"}>
        <Typography variant={TVariant.PresStart20} block height={"max-content"}>$DOG Locked</Typography>
      </Flex>
      <Flex flexGrow={1} alignItems={"center"}>
        <Box>
          <BigText size={"md"} label={abbr}>
            {num}
          </BigText>
        </Box>
      </Flex>
    </Flex>
  </Pane>
})

const TopDogs = observer(({store}: {store: DogParkPageStore}) => {
  return <Pane display={"flex"} flexDirection={"column"} h={"full"}>
    <Flex mb={6} alignItems={"center"}>
      <Typography variant={TVariant.PresStart20} block height={"max-content"}>Top Dogs</Typography>
      <Typography variant={TVariant.PresStart15} ml={3} height={"max-content"} block color={"yellow.75"}>({store.topDogs.length})</Typography>
    </Flex>
    <Box overflowY={"auto"} flexGrow={1} mt={4}>
      <Flex flexWrap={"wrap"} maxHeight={"300px"}>
        {store.topDogs.map((dog) => <UserCard key={`top-dog-${dog.address}`} store={store} dog={dog}/>)}
      </Flex>
    </Box>
  </Pane>
})

export default DogParkPage;

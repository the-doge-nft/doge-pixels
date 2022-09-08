import { Box, Flex, Grid, GridItem, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo } from "react";
import Pane from "../../DSL/Pane/Pane";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import DogParkPageStore from "./DogParkPage.store";
import TextInput from "../../DSL/Form/TextInput";
import Form from "../../DSL/Form/Form";
import model from "../../DSL/Form/model";
import AppStore from "../../store/App.store";
import UserCard from "./UserCard";
import { useHistory, useParams } from "react-router-dom";
import Icon from "../../DSL/Icon/Icon";
import PxPill from "./PxPill";
import PixelPane from "../../DSL/PixelPane/PixelPane";
import Button from "../../DSL/Button/Button";
import { convertToAbbreviation } from "../../helpers/numberFormatter";
import BigText from "../../DSL/BigText/BigText";
import { darkModeSecondary, lightModePrimary, lightOrDarkMode } from "../../DSL/Theme";
import { NamedRoutes, route, SELECTED_PIXEL_PARAM } from "../../App.routes";
import ParkPixels from "./ParkPixels";

const DogParkPage = observer(function DogParkPage() {
  const history = useHistory();
  const { address, tokenID } = useParams<{ address: string; tokenID: string }>();
  const store = useMemo(() => new DogParkPageStore(address, Number(tokenID)), [address, tokenID]);
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (AppStore.rwd.isMobile) {
      history.push(route(NamedRoutes.VIEWER));
    }
    // eslint-disable-next-line
  }, [AppStore.rwd.isMobile]);

  useEffect(() => {
    store.init();

    return () => {
      store.destroy()
    }
    // eslint-disable-next-line
  }, []);

  const setPupper = (pupper: number | null) => {
    store.selectedPixel = pupper;
    window.history.pushState(
      {},
      "",
      route(NamedRoutes.DOG_PARK, { address: store.selectedAddress, tokenID: store.selectedPixel }),
    );
  };
  return (
    <Flex flexDirection={"column"}>
      <GridItem ml={16}>
        <Flex height={"full"} flexDirection={"column"}>
          <Box mb={8}>
            <Form onSubmit={async () => {}}>
              <TextInput
                fontSize={"14px"}
                rightIcon={"search"}
                placeholder={"Search pixel owners"}
                {...model(store, "addressToSearch")}
              />
            </Form>
          </Box>

          <Flex flexDirection={"column"} flexGrow={1} h={"full"}>
            {!store.selectedAddress && <SearchHints store={store} />}
            {store.selectedAddress && (
              <>
                {!store.selectedUserHasPixels && <Box mb={5} h={store.selectedUserHasPixels ? "initial" : "full"}>
                    <Box w={"full"} h={"full"}>
                      <Flex alignItems={"center"} w={"full"} h={"full"} justifyContent={"center"}>
                        <Typography variant={TVariant.PresStart28} color={"#d6ceb6"}>
                          No pixels owned
                        </Typography>
                        <Typography variant={TVariant.PresStart28} mb={2} ml={3}>
                          😟
                        </Typography>
                      </Flex>
                    </Box>
                </Box>}
                {store.selectedUserHasPixels && (
                  <Flex
                    // templateRows={"max-content 1fr"}
                    // templateColumns={"repeat(2, 1fr)"}
                    flexWrap={"wrap"}
                    maxHeight="650px"
                    justifyContent={"center"}
                     >
                    <GridItem   display={"flex"} justifyContent={"center"} mx={4} >
                      {store.selectedOwner && (
                        <Box maxWidth={"fit-content"} mt={2}>
                          <Flex flexDirection={"column"}>
                            <ParkPixels
                              selectedPixel={store.selectedPixel ? store.selectedPixel : -1}
                              pixelOwner={store.selectedOwner}
                              onPupperClick={setPupper}
                            />
                            {store.selectedPixel && (
                              <Flex mt={3}>
                                <Grid templateColumns={"1fr 1fr"} templateRows={"1fr 1fr"} columnGap={2}>
                                  <GridItem>
                                    <Typography variant={TVariant.ComicSans18}>Pixel #:</Typography>
                                  </GridItem>
                                  <GridItem>
                                    <Typography variant={TVariant.ComicSans18} ml={2}>
                                      {store.seletedPixelIndex}
                                    </Typography>
                                  </GridItem>

                                  <GridItem>
                                    <Typography variant={TVariant.ComicSans18}>HEX:</Typography>
                                  </GridItem>
                                  <GridItem>
                                    <Typography variant={TVariant.ComicSans18} ml={2}>
                                      {store.selectedPixelHexColor}
                                    </Typography>
                                  </GridItem>

                                  <GridItem>
                                    <Typography variant={TVariant.ComicSans18}>Coordinates:</Typography>
                                  </GridItem>
                                  <GridItem>
                                    <Typography variant={TVariant.ComicSans18} ml={2}>
                                      ({store.selectedPixelCoordinates[0]},{store.selectedPixelCoordinates[1]})
                                    </Typography>
                                  </GridItem>
                                </Grid>
                                <Flex alignItems={"center"} justifyContent={"flex-end"} flexGrow={1}>
                                  <Button
                                    size={"sm"}
                                    onClick={() =>
                                      history.push(
                                        route(NamedRoutes.PIXELS, { [SELECTED_PIXEL_PARAM]: store.selectedPixel }),
                                      )
                                    }
                                  >
                                    Portal
                                  </Button>
                                </Flex>
                              </Flex>
                            )}
                          </Flex>
                        </Box>
                      )}
                    </GridItem>
                    <GridItem  display={"flex"}>
                      <Box overflowY={"auto"} flexGrow={1}>
                        <Flex flexWrap={{base: "nowrap", xl: "wrap"}} maxHeight={"300px"} justifyContent={"center"}>
                          {store.selectedOwner?.pixels.map(px => {
                            console.log('debug:: px', px)
                            const hex = AppStore.web3.pupperToHexLocal(px);
                            const index = AppStore.web3.pupperToIndexLocal(px);
                            return (
                              <Box
                                key={`user-dog-${px}`}
                                bg={
                                  store.selectedPixel === px
                                    ? colorMode === "light"
                                      ? lightModePrimary
                                      : darkModeSecondary
                                    : "inherit"
                                }
                                p={2}
                                mt={0}
                                _hover={{ bg: colorMode === "light" ? lightModePrimary : darkModeSecondary }}
                              >
                                <PixelPane
                                  showCoords={true}
                                  size={"sm"}
                                  key={`top_dog_${px}`}
                                  pupper={px}
                                  color={hex}
                                  pupperIndex={index}
                                  coordinates={AppStore.web3.pupperToPixelCoordsLocal(px)}
                                  onClick={px => {
                                    store.selectedPixel = px;
                                    window.history.pushState(
                                      {},
                                      "",
                                      route(NamedRoutes.DOG_PARK, {
                                        address: store.selectedAddress,
                                        tokenID: store.selectedPixel,
                                      }),
                                    );
                                  }}
                                />
                              </Box>
                            );
                          })}
                        </Flex>
                      </Box>
                    </GridItem>
                  </Flex>
                )}
              </>
            )}
          </Flex>
        </Flex>
      </GridItem>
      <GridItem display={"flex"} flexDirection={"column"} flexGrow={1}>
        <TopDogs store={store} />
        <Box mt={8}>
          <DogKennel store={store} />
        </Box>
      </GridItem>
    </Flex>
  );
});

const SearchHints = ({ store }: { store: DogParkPageStore }) => {
  return (
    <>
      {!store.isSearchInputEmpty && store.filteredOwners.length > 1 && (
        <Typography mt={2} variant={TVariant.PresStart18} block>
          Similar results
        </Typography>
      )}
      {!store.isSearchInputEmpty &&
        !store.selectedAddress &&
        store.filteredOwners.map(owner => <UserCard key={`filtered-dog-${owner.address}`} store={store} pixelOwner={owner} />)}
      {!store.isSearchInputEmpty && store.isFilteredResultEmpty && (
        <Typography variant={TVariant.PresStart15}>No results found</Typography>
      )}
    </>
  );
};

const DogKennel = observer(({ store }: { store: DogParkPageStore }) => {
  const [num, abbr] = store.lockedDog ? convertToAbbreviation(Math.trunc(store.lockedDog)) : ["N/A", ""];
  return (
    <Pane h={"inherit"}>
      <Flex flexDirection={"column"}>
        <Flex mb={6} alignItems={"flex-end"}>
          <Typography variant={TVariant.PresStart18} block height={"max-content"}>
            DOG Locked
          </Typography>
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
  );
});

const TopDogs = observer(({ store }: { store: DogParkPageStore }) => {
  const { colorMode } = useColorMode();
  return (
    <Pane display={"flex"} flexDirection={"column"} h={"full"}>
      <Flex mb={6} alignItems={"center"}>
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
          ({store.sortedPixelOwners.length})
        </Typography>
      </Flex>
      <Box overflowY={"auto"} flexGrow={1}>
        <Flex flexWrap={"wrap"} maxHeight={"300px"} sx={{flexGap: "10px"}}>
          {store.sortedPixelOwners.map(owner => (
            <UserCard isSelected={store.selectedOwner && store.selectedOwner.address === owner.address} key={`top-dog-${owner.address}`} store={store} pixelOwner={owner}>
                  {AppStore.web3?.address === owner.address && (
                    <Typography color={lightOrDarkMode(colorMode, "yellow.100", "gray.300")} variant={TVariant.PresStart12} ml={4}>
                      (you)
                    </Typography>
                  )}
            </UserCard>
          ))}
        </Flex>
      </Box>
    </Pane>
  );
});

export default DogParkPage;

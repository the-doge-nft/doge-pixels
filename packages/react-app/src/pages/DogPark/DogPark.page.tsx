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
    <Grid templateColumns={"0.5fr 1fr"} flexGrow={1}>
      <GridItem display={"flex"} flexDirection={"column"} flexGrow={1}>
        <TopDogs store={store} />
        <Box mt={8}>
          <DogKennel store={store} />
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
            {store.selectedAddress && (
              <>
                <Box mb={5} h={store.selectedUserHasPixels ? "initial" : "full"}>
                  <Flex alignItems={"center"}>
                    <Flex alignItems={"center"}>
                      <Icon icon={"person"} boxSize={6} />
                      <Typography variant={TVariant.PresStart20} ml={3}>
                        {store.selectedAddressDisplayName}
                      </Typography>
                      {store.isSelectedAddressAuthedUser && (
                        <Typography variant={TVariant.PresStart15} ml={3}>
                          (you)
                        </Typography>
                      )}
                    </Flex>
                    <Box ml={4}>
                      <PxPill count={store.selectedUserHasPixels ? store.selectedOwner?.pixels.length : 0} />
                    </Box>
                  </Flex>
                  {!store.selectedUserHasPixels && (
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
                  )}
                </Box>

                {store.selectedUserHasPixels && (
                  <Grid templateColumns={"1fr 1fr"} h={"full"}>
                    <GridItem display={"flex"} flexDirection={"column"}>
                      <Box overflowY={"auto"} flexGrow={1}>
                        <Flex flexWrap={"wrap"} maxHeight={"300px"}>
                          {store.selectedOwner?.pixels.map(px => {
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
                                m={1}
                                mt={0}
                                _hover={{ bg: colorMode === "light" ? lightModePrimary : darkModeSecondary }}
                              >
                                <PixelPane
                                  size={"sm"}
                                  key={`top_dog_${px}`}
                                  pupper={px}
                                  color={hex}
                                  pupperIndex={index}
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
                    <GridItem display={"flex"} justifyContent={"center"}>
                      {store.selectedOwner && (
                        <Box maxWidth={"fit-content"}>
                          <Flex flexDirection={"column"}>
                            <ParkPixels
                              selectedPixel={store.selectedPixel ? store.selectedPixel : -1}
                              pixelOwner={store.selectedOwner}
                              onPupperClick={setPupper}
                            />
                            {store.selectedPixel && (
                              <Box mt={10}>
                                <Box mt={1}>
                                  <Typography variant={TVariant.ComicSans18}>Pixel #:</Typography>
                                  <Typography variant={TVariant.ComicSans18} ml={2}>
                                    {store.seletedPixelIndex}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant={TVariant.ComicSans18}>HEX:</Typography>
                                  <Typography variant={TVariant.ComicSans18} ml={2}>
                                    {store.selectedPixelHexColor}
                                  </Typography>
                                </Box>
                                <Box mt={1}>
                                  <Typography variant={TVariant.ComicSans18}>Coordinates:</Typography>
                                  <Typography variant={TVariant.ComicSans18} ml={2}>
                                    ({store.selectedPixelCoordinates[0]},{store.selectedPixelCoordinates[1]})
                                  </Typography>
                                </Box>
                              </Box>
                            )}
                          </Flex>
                          {store.selectedPixel && (
                            <Button
                              onClick={() =>
                                history.push(
                                  route(NamedRoutes.PIXELS, { [SELECTED_PIXEL_PARAM]: store.selectedPixel }),
                                )
                              }
                              mt={10}
                            >
                              View in portal
                            </Button>
                          )}
                        </Box>
                      )}
                    </GridItem>
                  </Grid>
                )}
              </>
            )}
          </Flex>
        </Flex>
      </GridItem>
    </Grid>
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
      <Box overflowY={"auto"} flexGrow={1} mt={4}>
        <Flex flexWrap={"wrap"} maxHeight={"300px"}>
          {store.sortedPixelOwners.map(owner => (
            <UserCard key={`top-dog-${owner.address}`} store={store} pixelOwner={owner} />
          ))}
        </Flex>
      </Box>
    </Pane>
  );
});

export default DogParkPage;

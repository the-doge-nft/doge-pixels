import {Box, Flex, Grid, GridItem, useColorMode} from "@chakra-ui/react";
import {observer} from "mobx-react-lite";
import React, {useEffect, useMemo} from "react";
import Pane from "../../DSL/Pane/Pane";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import LeaderborkStore from "./Leaderbork.store";
import TextInput from "../../DSL/Form/TextInput";
import Form from "../../DSL/Form/Form";
import model from "../../DSL/Form/model";
import AppStore from "../../store/App.store";
import UserCard from "./UserCard";
import {useHistory, useParams} from "react-router-dom";
import PixelPane from "../../DSL/PixelPane/PixelPane";
import Button from "../../DSL/Button/Button";
import {convertToAbbreviation} from "../../helpers/numberFormatter";
import BigText from "../../DSL/BigText/BigText";
import {darkModeSecondary, lightModePrimary, lightOrDarkMode} from "../../DSL/Theme";
import {NamedRoutes, route, SELECTED_PIXEL_PARAM} from "../../App.routes";
import * as ethers from 'ethers'
import ParkPixels, {PixelPreviewSize} from "../../DSL/ParkPixels/ParkPixels";
import Link from "../../DSL/Link/Link";
import Typeahead from "../../DSL/Typeahead/Typeahead";

const LeaderborkPage = observer(function DogParkPage() {
    const history = useHistory();
    const {address, tokenID, activityId} = useParams<{ address?: string; tokenID?: string, activityId?: string }>();
    console.log("debug:: acitivyt id", activityId)
    const store = useMemo(() => new LeaderborkStore(address, Number(tokenID), activityId), [address, tokenID]);
    const {colorMode} = useColorMode();
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
            route(NamedRoutes.LEADERBORK, {address: store.selectedAddress, tokenID: store.selectedPixel}),
        );
    };
    return (
        <Grid
            p={{base: 5, md: 0}}
            templateRows={{base: "1fr 1fr", "xl": "1fr"}}
            templateColumns={{base: "1fr", "xl": "0.35fr 1fr"}}
        >
            <GridItem display={"flex"} flexDirection={"column"} flexGrow={1} order={{base: 2, xl: 1}}>
                <TopDogs store={store}/>
                <Box mt={8}>
                    <DogKennel store={store}/>
                </Box>
            </GridItem>
            <GridItem order={{base: 1, xl: 3}} ml={{base: 0, lg: 10}} display={'flex'} flexDirection={'column'}>
                <Box mb={8}>
                    <Typeahead
                        onItemSelect={(value) => store.selectedAddress = value as unknown as string}
                        items={store.ownersTypeaheadItems}
                        fontSize={"14px"}
                        icon={"search"}
                        placeholder={"Search pixel owners"}
                        value={store.searchValue}
                        onChange={(value) => {
                            console.log('debug:: value', value)
                            store.searchValue = value
                        }}
                        {...model(store, "searchValue")}
                    />
                </Box>
                <Flex flexDirection={"column"} flexGrow={1}>
                        <Flex flexDir={'column'} flexGrow={1}>
                          <Flex flexDir={{base: "column", md: "row"}} justifyContent={"flex-start"} mb={8} gap={8} flexGrow={1}>
                            <Flex justifyContent={"center"} flexGrow={0}>
                              <Pane margin={'auto'} maxW={'fit-content'} p={0} borderWidth={"0px"}>
                                <ParkPixels
                                  size={PixelPreviewSize.lg}
                                  id={'dog-park-pixels'}
                                  selectedTokenId={store.selectedActivityTokenId}
                                  previewPixels={store.selectedActivityTokenId ? [store.selectedActivityTokenId] : []}
                                  onPupperClick={(pupper) => console.log()}
                                />
                              </Pane>
                            </Flex>
                            <Pane flexGrow={1}>
                                {store.selectedActivityTransfer && <Flex flexDir={"column"} h={"full"}>
                                  <Flex gap={10}>
                                    <Box>
                                      <PixelPane size={"md"} pupper={store.selectedActivityTransfer?.tokenId} variant={"shadow"}/>
                                    </Box>
                                    <Flex flexDir={"column"} flexGrow={1}>
                                      <Flex flexDir={"column"}>
                                        <Typography variant={TVariant.PresStart18} mb={1}>{store.selectedActivityTransferDetails.title}</Typography>
                                        <Grid templateColumns={"0.5fr 1fr"}>
                                          <Typography variant={TVariant.ComicSans16}>by:</Typography>
                                          <Typography variant={TVariant.ComicSans16} overflowWrap={"anywhere"}>{store.selectedActivityTransferDetails.description}</Typography>
                                          <Typography variant={TVariant.ComicSans16}>token ID:</Typography>
                                          <Typography variant={TVariant.ComicSans16}>{store.selectedActivityTransfer.tokenId}</Typography>
                                          <Typography variant={TVariant.ComicSans16}>date:</Typography>
                                          <Typography variant={TVariant.ComicSans16} overflowWrap={"anywhere"}>{(new Date(store.selectedActivityTransfer.blockCreatedAt)).toLocaleDateString()}</Typography>
                                        </Grid>
                                      </Flex>
                                    </Flex>
                                  </Flex>
                                  <Flex justifyContent={'center'} alignItems={'center'} flexGrow={1}>
                                    <Link display={"inline-block"} isNav to={route(NamedRoutes.PIXELS, {[SELECTED_PIXEL_PARAM]: store.selectedActivityTransfer.tokenId})}>
                                      <Button onClick={() => console.log()}>Portal</Button>
                                    </Link>
                                  </Flex>
                                </Flex>}
                            </Pane>
                          </Flex>
                          <Pane title={<Typography variant={TVariant.PresStart18} mb={4} block>Recent Activity</Typography>} display={'flex'} flexDir={'column'} flexGrow={1}>

                            <Box overflowY={"scroll"} flexGrow={1}>
                              <Flex flexWrap={"wrap"} gap={0} maxHeight={'250px'}>
                                {!store.selectedAddress && store.transfers.map(transfer => <>
                                    <Box
                                        key={`user-dog-${transfer.uniqueTransferId}`}
                                        bg={
                                            store.selectedTransferId === transfer.uniqueTransferId
                                                ? colorMode === "light"
                                                    ? lightModePrimary
                                                    : darkModeSecondary
                                                : "inherit"
                                        }
                                        p={2}
                                        mt={0}
                                        _hover={{bg: colorMode === "light" ? lightModePrimary : darkModeSecondary}}
                                        onClick={() => store.selectedTransferId = transfer.uniqueTransferId}
                                        cursor={"pointer"}
                                    >
                                        <Box position={"relative"}>
                                            <Box position={"absolute"} left={"50%"} top={"50%"} zIndex={10}
                                                 style={{transform: "translate(-50%, -65%)"}}>
                                                <Typography variant={TVariant.ComicSans14}>
                                                    {transfer.from === ethers.constants.AddressZero && "✨"}
                                                    {transfer.to === ethers.constants.AddressZero && "🔥"}
                                                    {transfer.to !== ethers.constants.AddressZero && transfer.from !== ethers.constants.AddressZero && "✉️"}
                                                </Typography>
                                            </Box>
                                            <PixelPane
                                                // onClick={(pupper) => store.selectedTransferId = transfer.uniqueTransferId}
                                                size={"sm"}
                                                pupper={transfer.tokenId}
                                            />
                                        </Box>
                                    </Box>
                                </>)}
                                {store.selectedAddress && <Box>
                                  show the selected user's pixels
                                </Box>}
                              </Flex>
                            </Box>
                          </Pane>
                        </Flex>
                    {/*{store.selectedAddress && (*/}
                    {/*    <>*/}
                    {/*        {!store.selectedUserHasPixels &&*/}
                    {/*        <Box mb={5} h={store.selectedUserHasPixels ? "initial" : "full"}>*/}
                    {/*          <Box w={"full"} h={"full"}>*/}
                    {/*            <Flex alignItems={"center"} w={"full"} h={"full"} justifyContent={"center"}>*/}
                    {/*              <Typography variant={TVariant.PresStart28} color={"#d6ceb6"}>*/}
                    {/*                No pixels owned*/}
                    {/*              </Typography>*/}
                    {/*              <Typography variant={TVariant.PresStart28} mb={2} ml={3}>*/}
                    {/*                😟*/}
                    {/*              </Typography>*/}
                    {/*            </Flex>*/}
                    {/*          </Box>*/}
                    {/*        </Box>}*/}
                    {/*        {store.selectedUserHasPixels && (*/}
                    {/*            <Flex*/}
                    {/*                h={"full"}>*/}
                    {/*                <GridItem order={{base: 2, xl: 1}} display={"flex"}>*/}
                    {/*                    <Box overflowY={"auto"} flexGrow={1}>*/}
                    {/*                        <Flex flexWrap={"wrap"} maxHeight={"380px"} overflow="auto">*/}
                    {/*                            {store.selectedOwner?.pixels.map(px => {*/}
                    {/*                                const hex = AppStore.web3.pupperToHexLocal(px);*/}
                    {/*                                const index = AppStore.web3.pupperToIndexLocal(px);*/}
                    {/*                                return (*/}
                    {/*                                    <Box*/}
                    {/*                                        key={`user-dog-${px}`}*/}
                    {/*                                        bg={*/}
                    {/*                                            store.selectedPixel === px*/}
                    {/*                                                ? colorMode === "light"*/}
                    {/*                                                    ? lightModePrimary*/}
                    {/*                                                    : darkModeSecondary*/}
                    {/*                                                : "inherit"*/}
                    {/*                                        }*/}
                    {/*                                        p={2}*/}
                    {/*                                        mt={0}*/}
                    {/*                                        _hover={{bg: colorMode === "light" ? lightModePrimary : darkModeSecondary}}*/}
                    {/*                                    >*/}
                    {/*                                        <PixelPane*/}
                    {/*                                            size={"sm"}*/}
                    {/*                                            key={`top_dog_${px}`}*/}
                    {/*                                            pupper={px}*/}
                    {/*                                            onClick={px => {*/}
                    {/*                                                store.selectedPixel = px;*/}
                    {/*                                                window.history.pushState(*/}
                    {/*                                                    {},*/}
                    {/*                                                    "",*/}
                    {/*                                                    route(NamedRoutes.DOG_PARK, {*/}
                    {/*                                                        address: store.selectedAddress,*/}
                    {/*                                                        tokenID: store.selectedPixel,*/}
                    {/*                                                    }),*/}
                    {/*                                                );*/}
                    {/*                                            }}*/}
                    {/*                                        />*/}
                    {/*                                    </Box>*/}
                    {/*                                );*/}
                    {/*                            })}*/}
                    {/*                        </Flex>*/}
                    {/*                    </Box>*/}
                    {/*                </GridItem>*/}
                    {/*                <GridItem order={{base: 1, xl: 2}} display={"flex"} justifyContent={"center"}*/}
                    {/*                          mx={4}>*/}
                    {/*                    {store.selectedOwner && (*/}
                    {/*                        <Box maxWidth={"fit-content"} mt={2}>*/}
                    {/*                            <Flex flexDirection={"column"}>*/}
                    {/*                                <ParkPixels*/}
                    {/*                                  id={'dog-park-pixels'}*/}
                    {/*                                  selectedPixel={store.selectedPixel ? store.selectedPixel : -1}*/}
                    {/*                                  pixelOwner={store.selectedOwner}*/}
                    {/*                                  onPupperClick={setPupper}*/}
                    {/*                                />*/}
                    {/*                                {store.selectedPixel && (*/}
                    {/*                                    <Flex mt={3}>*/}
                    {/*                                        <Grid templateColumns={"1fr 1fr"} templateRows={"1fr 1fr"}*/}
                    {/*                                              columnGap={2}>*/}
                    {/*                                            <GridItem>*/}
                    {/*                                                <Typography variant={TVariant.ComicSans18}>Pixel*/}
                    {/*                                                    #:</Typography>*/}
                    {/*                                            </GridItem>*/}
                    {/*                                            <GridItem>*/}
                    {/*                                                <Typography variant={TVariant.ComicSans18} ml={2}>*/}
                    {/*                                                    {store.seletedPixelIndex}*/}
                    {/*                                                </Typography>*/}
                    {/*                                            </GridItem>*/}

                    {/*                                            <GridItem>*/}
                    {/*                                                <Typography*/}
                    {/*                                                    variant={TVariant.ComicSans18}>HEX:</Typography>*/}
                    {/*                                            </GridItem>*/}
                    {/*                                            <GridItem>*/}
                    {/*                                                <Typography variant={TVariant.ComicSans18} ml={2}>*/}
                    {/*                                                    {store.selectedPixelHexColor}*/}
                    {/*                                                </Typography>*/}
                    {/*                                            </GridItem>*/}

                    {/*                                            <GridItem>*/}
                    {/*                                                <Typography*/}
                    {/*                                                    variant={TVariant.ComicSans18}>Coordinates:</Typography>*/}
                    {/*                                            </GridItem>*/}
                    {/*                                            <GridItem>*/}
                    {/*                                                <Typography variant={TVariant.ComicSans18} ml={2}>*/}
                    {/*                                                    ({store.selectedPixelCoordinates[0]},{store.selectedPixelCoordinates[1]})*/}
                    {/*                                                </Typography>*/}
                    {/*                                            </GridItem>*/}
                    {/*                                        </Grid>*/}
                    {/*                                        <Flex alignItems={"center"} justifyContent={"flex-end"}*/}
                    {/*                                              flexGrow={1}>*/}
                    {/*                                            <Button*/}
                    {/*                                                size={"sm"}*/}
                    {/*                                                onClick={() =>*/}
                    {/*                                                    history.push(*/}
                    {/*                                                        route(NamedRoutes.PIXELS, {[SELECTED_PIXEL_PARAM]: store.selectedPixel}),*/}
                    {/*                                                    )*/}
                    {/*                                                }*/}
                    {/*                                            >*/}
                    {/*                                                Portal*/}
                    {/*                                            </Button>*/}
                    {/*                                        </Flex>*/}
                    {/*                                    </Flex>*/}
                    {/*                                )}*/}
                    {/*                            </Flex>*/}
                    {/*                        </Box>*/}
                    {/*                    )}*/}
                    {/*                </GridItem>*/}
                    {/*            </Flex>*/}
                    {/*        )}*/}
                    {/*    </>*/}
                    {/*)}*/}
                </Flex>
            </GridItem>
        </Grid>
    );
});

const DogKennel = observer(({store}: { store: LeaderborkStore }) => {
    const [num, abbr] = store.lockedDog ? convertToAbbreviation(Math.trunc(store.lockedDog)) : ["N/A", ""];
    return (
        <Pane h={"inherit"}>
            <Flex flexDirection={"column"}>
                <Flex mb={4} alignItems={"flex-end"}>
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

const TopDogs = observer(({store}: { store: LeaderborkStore }) => {
    const {colorMode} = useColorMode();
    return (
        <Pane display={"flex"} flexDirection={"column"} h={"full"}>
            <Flex mb={4} alignItems={"center"}>
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
                    ({AppStore.web3.sortedPixelOwners.length})
                </Typography>
            </Flex>
            <Box overflowY={"auto"} flexGrow={1}>
                <Flex flexWrap={"wrap"} maxHeight={"300px"} sx={{flexGap: "10px"}}>
                    {AppStore.web3.sortedPixelOwners.map(owner => (
                        <UserCard isSelected={store.selectedOwner && store.selectedOwner.address === owner.address}
                                  key={`top-dog-${owner.address}`} store={store} pixelOwner={owner}>
                            {AppStore.web3?.address === owner.address && (
                                <Typography color={lightOrDarkMode(colorMode, "yellow.100", "gray.300")}
                                            variant={TVariant.PresStart12} ml={4}>
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

export default LeaderborkPage;

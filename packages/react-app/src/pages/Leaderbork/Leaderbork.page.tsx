import {Box, Flex, Grid, GridItem, useColorMode} from "@chakra-ui/react";
import {observer} from "mobx-react-lite";
import React, {useEffect, useMemo} from "react";
import Pane from "../../DSL/Pane/Pane";
import Typography, {TVariant} from "../../DSL/Typography/Typography";
import LeaderborkStore, {SelectedOwnerTab} from "./Leaderbork.store";
import model from "../../DSL/Form/model";
import {useLocation, useParams} from "react-router-dom";
import PixelPane from "../../DSL/PixelPane/PixelPane";
import Button from "../../DSL/Button/Button";
import {darkModeSecondary, lightModePrimary} from "../../DSL/Theme";
import {NamedRoutes, route, SELECTED_PIXEL_PARAM} from "../../App.routes";
import * as ethers from 'ethers'
import ParkPixels, {PixelPreviewSize} from "../../DSL/ParkPixels/ParkPixels";
import Link from "../../DSL/Link/Link";
import Typeahead from "../../DSL/Typeahead/Typeahead";
import DogLocked from "./DogLocked";
import TopDogs from "./TopDogs";
import {getEtherscanURL} from "../../helpers/links";

const LeaderborkPage = observer(function DogParkPage() {
    const location = useLocation()
    let selectedOwnerTabType;
    if (location.pathname.indexOf(SelectedOwnerTab.Wallet) !== -1) {
        selectedOwnerTabType = SelectedOwnerTab.Wallet
    } else {
        selectedOwnerTabType = SelectedOwnerTab.Activity
    }
    const {address, tokenId, activityId} = useParams<{ address?: string; tokenId?: string, activityId?: string }>();
    const store = useMemo(() => new LeaderborkStore(address, tokenId ? Number(tokenId) : undefined, activityId, selectedOwnerTabType), [address, tokenId, selectedOwnerTabType]);
    const {colorMode} = useColorMode();
    useEffect(() => {
        store.init();
        return () => {
            store.destroy()
        }
        // eslint-disable-next-line
    }, []);

    return (
        <Grid
            p={{base: 5, md: 0}}
            templateRows={{base: "1fr 1fr", "xl": "1fr"}}
            templateColumns={{base: "1fr", "xl": "0.35fr 1fr"}}
        >
            <GridItem display={"flex"} flexDirection={"column"} flexGrow={1} order={{base: 2, xl: 1}}>
                <TopDogs store={store}/>
                <Box mt={8}>
                    <DogLocked dogLocked={store.lockedDog}/>
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
                              selectedTokenId={store.previewSelectedPixel}
                              previewPixels={store.previewPixels}
                              onPupperClick={store.selectedOwnerTab === SelectedOwnerTab.Wallet ? (tokenId) => store.selectedPixelId = tokenId : undefined}
                              // onPupperClick={(pixelId) => store.setSelectedPixelFromPreview(pixelId)}
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
                                    <Grid templateColumns={"0.75fr 1fr"}>
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
                      <Pane title={store.selectedAddress ? <Link target={"_blank"} to={getEtherscanURL(store.selectedAddress, "address")} mb={2}>{store.activityPaneTitle}</Link> : <Typography variant={TVariant.PresStart18} mb={4} block>{store.activityPaneTitle}</Typography>} display={'flex'} flexDir={'column'} flexGrow={1}>
                          {store.selectedAddress && <Flex gap={7} mb={4}>
                              {Object.keys(SelectedOwnerTab).map(item => <Box>
                                  <Typography
                                      textUnderlineOffset={3}
                                      cursor={"pointer"}
                                      onClick={() => store.setSelectedOwnerTab(SelectedOwnerTab[item])}
                                      textDecoration={SelectedOwnerTab[item] === store.selectedOwnerTab ? "underline" : "inherit"}
                                      variant={TVariant.PresStart12}>
                                      {item}
                                  </Typography>
                              </Box>)}
                          </Flex>}

                        <Box overflowY={"scroll"} flexGrow={1}>
                          <Flex flexWrap={"wrap"} gap={0} maxHeight={'250px'}>
                            {(store.selectedOwnerTab === SelectedOwnerTab.Activity || !store.selectedAddress) && store.transfers.map(transfer => <>
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
                                    onClick={() => store.setActivityId(transfer.uniqueTransferId)}
                                    cursor={"pointer"}
                                >
                                    <Box position={"relative"}>
                                        <Box position={"absolute"} left={"50%"} top={"50%"} zIndex={10}
                                             style={{transform: "translate(-50%, -65%)"}}>
                                            <Typography variant={TVariant.ComicSans14}>
                                                {transfer.from.address === ethers.constants.AddressZero && "✨"}
                                                {transfer.to.address === ethers.constants.AddressZero && "🔥"}
                                                {transfer.to.address !== ethers.constants.AddressZero && transfer.from.address !== ethers.constants.AddressZero && "✉️"}
                                            </Typography>
                                        </Box>
                                        <PixelPane
                                            size={"sm"}
                                            pupper={transfer.tokenId}
                                        />
                                    </Box>
                                </Box>
                            </>)}
                              {store.selectedOwnerTab === SelectedOwnerTab.Wallet && store.selectedOwner?.pixels.map(tokenId => <Box
                                  key={`user-dog-${tokenId}`}
                                  bg={
                                      store.selectedPixelId === tokenId
                                          ? colorMode === "light"
                                              ? lightModePrimary
                                              : darkModeSecondary
                                          : "inherit"
                                  }
                                  p={2}
                                  mt={0}
                                  _hover={{bg: colorMode === "light" ? lightModePrimary : darkModeSecondary}}
                                  onClick={() => store.setSelectedPixelId(tokenId)}
                                  cursor={"pointer"}
                              >
                                      <PixelPane
                                          size={"sm"}
                                          pupper={tokenId}
                                      />
                              </Box>)}
                          </Flex>
                        </Box>
                      </Pane>
                    </Flex>
                </Flex>
            </GridItem>
        </Grid>
    );
});


export default LeaderborkPage;

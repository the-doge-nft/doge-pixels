import { Box, Flex, Grid, GridItem, useColorMode } from "@chakra-ui/react";
import { ethers } from "ethers";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import { generatePath, Link as RouterLink, useLocation, useParams } from "react-router-dom";
import { NamedRoutes, route, SELECTED_PIXEL_PARAM } from "../../App.routes";
import Button from "../../DSL/Button/Button";
import { Type } from "../../DSL/Fonts/Fonts";
import model from "../../DSL/Form/model";
import Icon from "../../DSL/Icon/Icon";
import Link from "../../DSL/Link/Link";
import Pane from "../../DSL/Pane/Pane";
import PixelPane from "../../DSL/PixelPane/PixelPane";
import PixelPreview, { PixelPreviewSize } from "../../DSL/PixelPreview/PixelPreview";
import { darkModeSecondary, lightModePrimary, lightOrDarkMode } from "../../DSL/Theme";
import Typeahead from "../../DSL/Typeahead/Typeahead";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { getEtherscanURL } from "../../helpers/links";
import AppStore from "../../store/App.store";
import DogLocked from "./DogLocked";
import LeaderborkStore, { SelectedOwnerTab } from "./Leaderbork.store";
import TopDogs from "./TopDogs";

const LeaderborkPage = observer(function LeaderborkPage() {
  const location = useLocation();
  let selectedOwnerTabType;
  if (location.pathname.indexOf(SelectedOwnerTab.Wallet) !== -1) {
    selectedOwnerTabType = SelectedOwnerTab.Wallet;
  } else {
    selectedOwnerTabType = SelectedOwnerTab.Activity;
  }
  const { address, tokenId, activityId } = useParams<{ address?: string; tokenId?: string; activityId?: string }>();
  const store = useMemo(
    () => new LeaderborkStore(address, tokenId ? Number(tokenId) : undefined, activityId, selectedOwnerTabType),
    [],
  );
  const { colorMode } = useColorMode();
  useEffect(() => {
    store.init();
    return () => {
      store.destroy();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Flex w={"full"} flexDir={{ base: "column", xl: "row" }} mt={{ base: 20, md: 0 }}>
      <Flex
        flexBasis={0}
        grow={0}
        gap={8}
        display={"flex"}
        flexDirection={"column"}
        mt={{ base: 8, xl: 0 }}
        order={{ base: 2, xl: 1 }}
      >
        <TopDogs store={store} />
        <Box>
          <DogLocked dogLocked={store.lockedDog} />
        </Box>
      </Flex>
      <Flex flexGrow={1} order={{ base: 1, xl: 3 }} ml={{ base: 0, xl: 10 }} display={"flex"} flexDirection={"column"}>
        <Box mb={8}>
          <LeaderborkTypeahead store={store} />
        </Box>
        <Flex flexDir={"column"} flexGrow={1}>
          <Flex
            flexDir={{ base: "column", md: "row" }}
            justifyContent={"flex-start"}
            mb={8}
            gap={8}
            flexGrow={"initial"}
          >
            <Flex justifyContent={"center"} flexGrow={0}>
              <Pane margin={"auto"} maxW={"fit-content"} p={0} borderWidth={"0px"}>
                <PixelPreview
                  size={AppStore.rwd.isMobile ? PixelPreviewSize.sm : PixelPreviewSize.lg}
                  id={"dog-park-pixels"}
                  selectedTokenId={store.previewSelectedPixelId}
                  previewPixels={store.previewPixels}
                  onPupperClick={
                    store.selectedOwnerTab === SelectedOwnerTab.Wallet
                      ? tokenId => (store.selectedPixelId = tokenId)
                      : undefined
                  }
                />
              </Pane>
            </Flex>

            <Pane flexGrow={1}>
              {store.showDetails && (
                <Flex flexDir={"column"} h={"full"}>
                  <Flex gap={10} flexDir={{ base: "column", md: "row" }}>
                    {store.previewSelectedPixelId && (
                      <Box>
                        <PixelPane size={"md"} pupper={store.previewSelectedPixelId} variant={"shadow"} />
                      </Box>
                    )}
                    <Flex flexDir={"column"} flexGrow={1}>
                      <Flex flexDir={"column"}>
                        {store.selectedActivityTransfer &&
                          (store.selectedOwnerTab !== SelectedOwnerTab.Wallet || !store.selectedAddress) && (
                            <Typography variant={TVariant.PresStart18} mb={1}>
                              {store.selectedActivityTransferDetails.title}
                            </Typography>
                          )}
                        <Grid templateColumns={"0.75fr 1fr"}>
                          {(store.selectedOwnerTab === SelectedOwnerTab.Activity || !store.selectedAddress) &&
                            store.selectedActivityTransfer && (
                              <>
                                {store.selectedActivityTransferDetails.title === "Transfer" && (
                                  <>
                                    <GridItem
                                      display={"flex"}
                                      gap={2}
                                      colSpan={2}
                                      alignItems={"center"}
                                      justifyContent={"space-between"}
                                    >
                                      <Link
                                        to={`/leaderbork/${store.selectedActivityTransferDetails.description.from.address}/wallet`}
                                        variant={Type.ComicSans}
                                        size={"md"}
                                      >
                                        {store.selectedActivityTransferDetails.description.from.displayName}
                                      </Link>
                                      <Icon icon={"arrow-right"} boxSize={5} />
                                      <Link
                                        to={`/leaderbork/${store.selectedActivityTransferDetails.description.to.address}/wallet`}
                                        variant={Type.ComicSans}
                                        size={"md"}
                                      >
                                        {store.selectedActivityTransferDetails.description.to.displayName}
                                      </Link>
                                    </GridItem>
                                  </>
                                )}
                                {store.selectedActivityTransferDetails.title !== "Transfer" && (
                                  <>
                                    <Typography variant={TVariant.ComicSans16}>by:</Typography>
                                    <Link
                                      isNav
                                      to={`/leaderbork/${
                                        store.selectedActivityTransferDetails.description.from
                                          ? store.selectedActivityTransferDetails.description.from.address
                                          : store.selectedActivityTransferDetails.description.to.address
                                      }/wallet`}
                                      variant={Type.ComicSans}
                                      size={"md"}
                                      overflowWrap={"anywhere"}
                                    >
                                      {store.selectedActivityTransferDetails.description.from
                                        ? store.selectedActivityTransferDetails.description.from.displayName
                                        : store.selectedActivityTransferDetails.description.to.displayName}
                                    </Link>
                                  </>
                                )}
                              </>
                            )}
                          {store.previewSelectedPixelId && (
                            <>
                              <Typography variant={TVariant.ComicSans16}>ID:</Typography>
                              <Typography variant={TVariant.ComicSans16}>{store.previewSelectedPixelId}</Typography>
                              <Typography variant={TVariant.ComicSans16}>hex:</Typography>
                              <Typography variant={TVariant.ComicSans16}>
                                {AppStore.web3.pupperToHexLocal(store.previewSelectedPixelId)}
                              </Typography>
                              <Typography variant={TVariant.ComicSans16}>coords:</Typography>
                              <Typography variant={TVariant.ComicSans16}>
                                ({AppStore.web3.pupperToPixelCoordsLocal(store.previewSelectedPixelId)[0]},{" "}
                                {AppStore.web3.pupperToPixelCoordsLocal(store.previewSelectedPixelId)[1]})
                              </Typography>
                            </>
                          )}
                          {(store.selectedOwnerTab === SelectedOwnerTab.Activity || !store.selectedAddress) &&
                            store.selectedActivityTransfer && (
                              <>
                                <Typography variant={TVariant.ComicSans16}>date:</Typography>
                                <Typography variant={TVariant.ComicSans16} overflowWrap={"anywhere"}>
                                  {new Date(store.selectedActivityTransfer.blockCreatedAt).toLocaleDateString()}
                                </Typography>
                              </>
                            )}
                        </Grid>
                      </Flex>
                    </Flex>
                  </Flex>
                  {store.selectedPixelId && store.selectedAddress && (
                    <Flex justifyContent={"center"} alignItems={"center"} flexGrow={1} mt={{ base: 4, md: 0 }}>
                      <Link
                        display={"inline-block"}
                        isNav
                        to={route(NamedRoutes.PIXELS, { [SELECTED_PIXEL_PARAM]: store.previewSelectedPixelId })}
                      >
                        <Button onClick={() => {}}>Portal</Button>
                      </Link>
                    </Flex>
                  )}
                </Flex>
              )}
              {!store.showDetails && (
                <Flex flexDir={"column"} h={"full"}>
                  <Box opacity={0.5}>
                    <PixelPane pupper={1268869} size={"md"} variant={"shadow"} />
                  </Box>
                  <Flex alignItems={"center"} flexGrow={1} justifyContent={"center"}>
                    <Typography
                      variant={TVariant.PresStart16}
                      color={lightOrDarkMode(colorMode, "yellow.100", "gray.300")}
                    >
                      Select a pixel
                    </Typography>
                  </Flex>
                </Flex>
              )}
            </Pane>
          </Flex>
          <Pane
            title={
              store.selectedAddress ? (
                <Link
                  pb={1}
                  w={"full"}
                  textOverflow={"ellipsis"}
                  overflow={"hidden"}
                  wordBreak={"break-all"}
                  whiteSpace={"nowrap"}
                  target={"_blank"}
                  to={getEtherscanURL(store.selectedAddress, "address")}
                  mb={2}
                >
                  {store.activityPaneTitle}
                </Link>
              ) : (
                <Typography variant={TVariant.PresStart18} mb={4} block>
                  {store.activityPaneTitle}
                </Typography>
              )
            }
            display={"flex"}
            flexDir={"column"}
            flexGrow={1}
          >
            {store.selectedAddress && (
              <Flex gap={7} mb={4}>
                {Object.keys(SelectedOwnerTab).map(item => (
                  <Box key={`tab-${item}`}>
                    <Typography
                      textUnderlineOffset={3}
                      _hover={{
                        cursor: "pointer",
                      }}
                      onClick={() => store.setSelectedOwnerTab(SelectedOwnerTab[item])}
                      textDecoration={SelectedOwnerTab[item] === store.selectedOwnerTab ? "underline" : "inherit"}
                      variant={TVariant.PresStart12}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Flex>
            )}

            <Box overflowY={"auto"} flexGrow={1}>
              <Flex flexWrap={"wrap"} gap={0} maxHeight={"250px"}>
                {(store.selectedOwnerTab === SelectedOwnerTab.Activity || !store.selectedAddress) &&
                  store.transfers.map(transfer => (
                    <RouterLink
                      to={
                        store.selectedOwner
                          ? generatePath(`/leaderbork/:address/${SelectedOwnerTab.Activity}/:activityId`, {
                              address: store.selectedAddress,
                              activityId: transfer.uniqueTransferId,
                            })
                          : generatePath(`/leaderbork/${SelectedOwnerTab.Activity}/:activityId`, {
                              activityId: transfer.uniqueTransferId,
                            })
                      }
                      onClick={() => store.setActivityId(transfer.uniqueTransferId)}
                    >
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
                        _hover={{ bg: colorMode === "light" ? lightModePrimary : darkModeSecondary }}
                      >
                        <Box position={"relative"}>
                          <Box
                            position={"absolute"}
                            left={"50%"}
                            top={"50%"}
                            zIndex={10}
                            style={{ transform: "translate(-50%, -65%)" }}
                          >
                            <Typography variant={TVariant.ComicSans14}>
                              {transfer.from.address === ethers.constants.AddressZero && "✨"}
                              {transfer.to.address === ethers.constants.AddressZero && "🔥"}
                              {transfer.to.address !== ethers.constants.AddressZero &&
                                transfer.from.address !== ethers.constants.AddressZero &&
                                "✉️"}
                            </Typography>
                          </Box>
                          <PixelPane size={"sm"} pupper={transfer.tokenId} />
                        </Box>
                      </Box>
                    </RouterLink>
                  ))}
                {store.selectedOwnerTab === SelectedOwnerTab.Wallet &&
                  store.selectedOwner?.pixels.map(tokenId => (
                    <Box
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
                      _hover={{ bg: colorMode === "light" ? lightModePrimary : darkModeSecondary }}
                      onClick={() => store.setSelectedPixelId(tokenId)}
                      cursor={"pointer"}
                    >
                      <PixelPane size={"sm"} pupper={tokenId} />
                    </Box>
                  ))}
              </Flex>
            </Box>
          </Pane>
        </Flex>
      </Flex>
    </Flex>
  );
});

const LeaderborkTypeahead = observer(function LeaderborkTypeahead({ store }: { store: LeaderborkStore }) {
  return (
    <Typeahead
      name={"textinput"}
      icon={"search"}
      fontSize={"14px"}
      placeholder={"Search pixel owners"}
      onItemSelect={value => (store.selectedAddress = value as unknown as string)}
      items={store.ownersTypeaheadItems}
      onClear={() => (store.searchValue = "")}
      {...model(store, "searchValue")}
    />
  );
});

export default LeaderborkPage;

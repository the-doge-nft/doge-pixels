import React from "react";
import {observer} from "mobx-react-lite";
import {Box, Flex, Image, VStack} from "@chakra-ui/react";
import Typography, {TVariant} from "../../../DSL/Typography/Typography";
import ViewerStore from "../Viewer.store";
import Button from "../../../DSL/Button/Button";
import PixelPane from "../../../DSL/PixelPane/PixelPane";
import {SELECT_PIXEL} from "../../../services/mixins/eventable";
import AppStore from "../../../store/App.store";
import Dev from "../../../common/Dev";
import {isDevModeEnabled, isStaging} from "../../../environment/helpers";
import Link from "../../../DSL/Link/Link";
import {generatePath} from "react-router-dom";

const SelectedPixelPane = observer(function SelectedPixelPane({store}: { store: ViewerStore }) {
    return (
        <Flex flexDirection={"column"} justifyContent={"space-between"} h={"full"}>
            <Box>
                <Box>
                    {store.selectedPupper && (
                        <PixelPane
                            size={"md"}
                            pupper={store.selectedPupper}
                            variant={"shadow"}
                            onClick={() => store.publish(SELECT_PIXEL, [store.selectedPixelX, store.selectedPixelY])}
                        />
                    )}
                </Box>

                {store.metaData && (
                    <Dev>
                        <Box mt={10} border={"1px dashed black"} p={3}>
                            <Typography variant={TVariant.ComicSans12} fontWeight={"bold"} mb={2} block>
                                DEBUG METADATA
                            </Typography>
                            <Typography block variant={TVariant.ComicSans12}>
                                {store.metaData.name}
                            </Typography>
                            <Typography block variant={TVariant.ComicSans12}>
                                {store.metaData.description}
                            </Typography>
                            {store.metaData.attributes?.map(item => (
                                <Typography block variant={TVariant.ComicSans12}>
                                    {item.trait_type}: {item.value}
                                </Typography>
                            ))}
                            <Image src={store.metaData.image} height={25} width={25}/>
                        </Box>
                    </Dev>
                )}

                <Box mt={6}>
                    <Box>
                        <Typography variant={TVariant.ComicSans18} mr={2}>
                            Index:
                        </Typography>
                        <Typography variant={TVariant.ComicSans18}>{store.selectedPupperIndex}</Typography>
                    </Box>
                    <Box>
                        <Typography variant={TVariant.ComicSans18} mr={2}>
                            HEX:
                        </Typography>
                        <Typography variant={TVariant.ComicSans18}>{store.selectedPupperHEX}</Typography>
                    </Box>
                    {store.tokenOwner && (
                        <Box mt={12}>
                            <Typography variant={TVariant.ComicSans18} mr={2}>
                                Owned by
                            </Typography>

                            <Flex alignItems={"center"} pt={AppStore.rwd.isMobile ? 3 : 0}>
                                {AppStore.rwd.isMobile && (
                                    <Box>
                                        <Typography block variant={TVariant.PresStart18}>
                                            {store.selectedTokenOwnerDisplayName}
                                        </Typography>
                                    </Box>
                                )}
                                {!AppStore.rwd.isMobile && (
                                    <Box mt={2}>
                                        <Link
                                            maxW={"200px"}
                                            overflowWrap={"initial"}
                                            overflow={"hidden"}
                                            textOverflow={"ellipsis"}
                                            isNav
                                            to={generatePath("/leaderbork/:address/wallet/:tokenId", {
                                                address: store.tokenOwner,
                                                tokenId: store.selectedPupper,
                                            })}
                                        >
                                            {store.selectedTokenOwnerDisplayName}
                                        </Link>
                                    </Box>
                                )}
                            </Flex>

                            <Flex justifyContent={"center"} mt={12}>
                                <Link
                                    href={
                                        isDevModeEnabled() || isStaging()
                                            ? `https://testnets.opensea.io/assets/${AppStore.web3.pxContractAddress}/${store.selectedPupper}`
                                            : `https://opensea.io/assets/${AppStore.web3.pxContractAddress}/${store.selectedPupper}`
                                    }
                                >
                                    View on Opensea
                                </Link>
                            </Flex>
                        </Box>
                    )}
                </Box>
            </Box>
            {store.isSelectedPupperOwned && !AppStore.rwd.isMobile && (
                <VStack spacing={9} mt={6}>
                    <Button onClick={() => (store.modals.isBurnModalOpen = true)}>Burn</Button>
                </VStack>
            )}
        </Flex>
    );
});

export default SelectedPixelPane;

import ViewerStore from "../Viewer.store";
import {Box, Flex, useColorMode} from "@chakra-ui/react";
import Typography, {TVariant} from "../../../DSL/Typography/Typography";
import React from "react";
import {observer} from "mobx-react-lite";
import AppStore from "../../../store/App.store";
import PixelPane from "../../../DSL/PixelPane/PixelPane";
import {darkModeSecondary, lightModePrimary, lightOrDarkMode} from "../../../DSL/Theme";
import Tooltip from "../../../DSL/Tooltip/Tooltip";

const ManagePane = observer(function ManagePane({store}: { store: ViewerStore }) {
    const {colorMode} = useColorMode();
    return (
        <>
            <Box>
                <Box mb={3}>
                    <Typography variant={TVariant.PresStart12}>
                        Your Pixels
                    </Typography>
                    <Typography ml={2} color={lightOrDarkMode(colorMode, "yellow.100", "gray.300")}
                                variant={TVariant.PresStart14}>
                        ({AppStore.web3.puppersOwned.length})
                    </Typography>
                </Box>
                {/*<PixelPreview*/}
                {/*    onPupperClick={(pixelId) => store.selectedPupper = pixelId}*/}
                {/*    size={PixelPreviewSize.sm}*/}
                {/*    previewPixels={AppStore.web3.puppersOwned}*/}
                {/*    selectedTokenId={store.selectedPupper}*/}
                {/*    id={'your-pixels-manage'}*/}
                {/*/>*/}
                <Box maxHeight={"300px"} maxW={"300px"}>
                    {AppStore.web3.puppersOwned.map(px => {
                        const [x, y] = AppStore.web3.pupperToPixelCoordsLocal(px)
                        return (
                            <Box
                                flexGrow={0}
                                p={1}
                                display={"inline-block"}
                                key={`manage-${px}`}
                                _hover={{
                                    bg: colorMode === "light" ? lightModePrimary : darkModeSecondary,
                                }}
                            >
                                <Tooltip label={`(${x}, ${y})`}>
                                    <PixelPane
                                        isNew={store.getIsPupperNew(px)}
                                        size={"xxs"}
                                        onClick={() => store.onManagePixelClick(px)}
                                        pupper={px}
                                    />
                                </Tooltip>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </>
    );
});

export default ManagePane;

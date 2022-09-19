import { Box, Grid, GridItem, Img, Menu, MenuButton, MenuItem, MenuList, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import Pane from "../../DSL/Pane/Pane";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import PixelArtPageStore, { Sticker } from "./PixelArtPage.store";
import Icon from "../../DSL/Icon/Icon";
import { darkModeSecondary, lightModePrimary, lightOrDarkMode } from "../../DSL/Theme";
import { ClearCanvasAction, IdenticonAction, PixelAction } from "./PixelArtActions";
import { PixelArtTool, pixelArtTools } from "./PixelArtTools";
import { TRANSPARENT_PIXEL } from "./PixelArtCanvas";
import ImportTemplateModal from "./ImportTemplateModal/ImportTemplateModal";
import CanvasPropertiesModal from "./CanvasPropertiesModal/CanvasPropertiesModal";
import StickerComponent from "./StickerComponent";
import ImportStickerModal from "./ImportStickerModal/ImportStickerModal";
import AppStore from "../../store/App.store";
import Link from "../../DSL/Link/Link";
import {isDevModeEnabled, isProduction, isStaging} from "../../environment/helpers";
import {Http} from "../../services";
import shareToTwitter, {TwitterShareType} from "../../helpers/shareToTwitter";

const CANVAS_ELEMENT_SIZE = 512;

const PixelArtPage = observer(function PixelArtPage() {
    const store = useMemo(() => new PixelArtPageStore(), []);

    useEffect(() => {
        if (isProduction())
            store.selectedAddress = AppStore.web3.address ? AppStore.web3.address : '';

        document.addEventListener("keydown", handleHotkeys, false);

        return () => {
            document.removeEventListener("keydown", handleHotkeys);
        };
    });

    useEffect(() => {
        if (isProduction())
            store.selectedAddress = AppStore.web3.address ? AppStore.web3.address : '';
    }, [AppStore.web3.address])

    const handleHotkeys = (e: KeyboardEvent) => {
        const ctrlPressed = window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey;
        if (ctrlPressed && e.shiftKey && e.code === "KeyZ") {
            e.preventDefault();
            store.redoAction();
        } else if (ctrlPressed && e.code === "KeyZ") {
            e.preventDefault();
            store.undoAction();
        } else if (ctrlPressed && e.code === "KeyS") {
            e.preventDefault();
            store.saveProject();
        }
    };

    return (
        <Pane mt={6} margin={"auto"} maxW={"fit-content"} display={"flex"} flexDirection={"column"} padding={"0px"}>
            {
                store.selectedAddress === '' &&
                <Box>
                    <Typography align='center' variant={TVariant.PresStart20}>
                        <Box m={10} mb={5}>
                            Please connect your wallet
                        </Box>
                        <Box mb={10}>
                            to generate art
                        </Box>
                    </Typography>
                    <Box m={10}>
                        <Img m={'auto'} maxHeight={400} src="./pixel-art.png"/>
                    </Box>
                </Box>
            }
            {
                store.selectedAddress !== '' && (!store.palette || !store.palette.length) &&
                <Box>
                    <Typography align='center' variant={TVariant.PresStart20}>
                        <Box m={10} mb={5}>
                            Please{" "}
                            <a
                                target="_blank"
                                href={"https://opensea.io/collection/doge-pixels"}
                                style={{
                                    textDecoration: 'underline'
                                }}
                            >
                                mint Doge Pixels
                            </a>
                        </Box>
                        <Box mb={10}>
                            to generate art
                        </Box>
                    </Typography>
                    <Box m={10}>
                        <Img m={'auto'} maxHeight={400} src="./pixel-art.png"/>
                    </Box>
                </Box>
            }
            {
                store.selectedAddress !== '' && store.palette && store.palette.length > 0 &&
                <Box>
                    <Grid>
                        <GridItem display={"flex"} flexDirection={"column"} flexGrow={0}>
                            <MainMenuComponent store={store} />
                            <Box border={"0.5px solid gray"} mx={"10px"} marginBottom={"5px"} />
                            <GridItem display={"flex"} flexDirection={"row"} flexGrow={0}>
                                <ToolsComponent store={store} />
                                {/*<Box h={'97%'} border={'0.5px solid gray'} my={'10px'}/>*/}
                                <ArtCanvasComponent store={store} />
                            </GridItem>
                            <Box border={"0.5px solid gray"} mx={"10px"} />
                            <PixelsPaletteComponent store={store} />
                        </GridItem>
                    </Grid>
                    <a id={"pfp-link"} />
                    {store.isImportTemplateModalOpened && (
                        <ImportTemplateModal
                            store={store}
                            isOpen={store.isImportTemplateModalOpened}
                            onClose={() => {
                                store.isImportTemplateModalOpened = false;
                            }}
                        />
                    )}
                    {store.isImportStickerModalOpened && (
                        <ImportStickerModal
                            store={store}
                            isOpen={store.isImportStickerModalOpened}
                            onClose={() => {
                                store.isImportStickerModalOpened = false;
                            }}
                        />
                    )}
                    {store.isCanvasPropertiesModalOpened && (
                        <CanvasPropertiesModal
                            store={store}
                            isOpen={store.isCanvasPropertiesModalOpened}
                            onClose={() => {
                                store.isCanvasPropertiesModalOpened = false;
                            }}
                        />
                    )}
                </Box>
            }
        </Pane>
    );
});

const ArtCanvasComponent = observer(({ store }: { store: PixelArtPageStore }) => {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        let canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        store.setCanvas(canvas);
        setScale(getScale());
    });

    useEffect(() => {
        setScale(getScale());
        store.pixelsCanvas.updateCanvas();
    }, [AppStore.rwd.isMobile]);

    const getScale = () => {
        return AppStore.rwd.isMobile ? 0.6 : 1;
    };

    const updatePixel = (x: number, y: number, action: PixelAction) => {
        let canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();
        const canvasCellSize = (CANVAS_ELEMENT_SIZE * scale) / store.pixelsCanvas.canvasSize;
        if (rect.left < x && rect.right > x && rect.top < y && rect.bottom > y) {
            const canvasX = Math.floor((x - rect.x) / canvasCellSize);
            const canvasY = Math.floor((y - rect.y) / canvasCellSize);
            action.update(store, canvasX, canvasY);
        }
    };

    const onMouseDown = (mouseDownEvent: any) => {
        if (!store.palette || !store.palette.length) return;

        let clientX = mouseDownEvent.clientX;
        let clientY = mouseDownEvent.clientY;

        if (mouseDownEvent.changedTouches) {
            let ourTouch = false;
            for (let touch of mouseDownEvent.changedTouches) {
                if (touch.identifier === 0) {
                    clientX = touch.clientX;
                    clientY = touch.clientY;
                    ourTouch = true;
                    break;
                }
            }
            if (!ourTouch) return;
        }

        const color =
            pixelArtTools[store.selectedToolIndex].id === PixelArtTool.pen
                ? store.palette[store.selectedBrushPixelIndex]
                : TRANSPARENT_PIXEL;
        let action = new PixelAction(color);
        let lastX = clientX;
        let lastY = clientY;
        updatePixel(clientX, clientY, action);

        function onMouseMove(mouseMoveEvent: any) {
            let clientX = mouseMoveEvent.clientX;
            let clientY = mouseMoveEvent.clientY;

            if (mouseMoveEvent.changedTouches) {
                let ourTouch = false;
                for (let touch of mouseMoveEvent.changedTouches) {
                    if (touch.identifier === 0) {
                        clientX = touch.clientX;
                        clientY = touch.clientY;
                        ourTouch = true;
                        break;
                    }
                }
                if (!ourTouch) return;
            }

            const cn = 10;
            let dx = (clientX - lastX) / cn;
            let dy = (clientY - lastY) / cn;
            for (let cd = 0; cd < cn; ++cd) {
                const x = lastX + dx * cd;
                const y = lastY + dy * cd;
                updatePixel(x, y, action);
            }
            lastX = clientX;
            lastY = clientY;
        }
        function onMouseUp() {
            if (action.isValid()) {
                store.pushAction(action);
            }

            document.body.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("touchmove", onMouseMove);
        }

        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp, { once: true });

        window.addEventListener("touchmove", onMouseMove);
        window.addEventListener("touchend", onMouseUp, { once: true });

    };

    return (
        <Box
            border={"1px solid gray"}
            margin={"5px"}
            background={
                "linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), white"
            }
            backgroundRepeat={"repeat, repeat"}
            backgroundPosition={"0px 0, 8px 8px"}
            transformOrigin={"0 0 0"}
            backgroundClip={"border-box, border-box"}
            backgroundSize={"16px 16px, 16px 16px"}
        >
            <Box overflow={"hidden"} width={CANVAS_ELEMENT_SIZE * scale} height={CANVAS_ELEMENT_SIZE * scale}>
                <Box
                    position={"relative"}
                    top={store.templateTop * CANVAS_ELEMENT_SIZE * scale + "px"}
                    left={store.templateLeft * CANVAS_ELEMENT_SIZE * scale + "px"}
                    width={store.templateWidth * CANVAS_ELEMENT_SIZE * scale + "px"}
                    height={store.templateHeight * CANVAS_ELEMENT_SIZE * scale + "px"}
                    backgroundImage={store.isTemplateVisible ? store.templateImage : ""}
                    backgroundSize={"contain"}
                    backgroundPosition={"center"}
                    backgroundRepeat={"no-repeat"}
                    opacity={0.5}
                />
                <canvas
                    style={{
                        position: "relative",
                        top: -store.templateHeight * scale * CANVAS_ELEMENT_SIZE,
                        //touchAction: 'none'
                    }}
                    id="canvas"
                    width={CANVAS_ELEMENT_SIZE * scale}
                    height={CANVAS_ELEMENT_SIZE * scale}
                    onMouseDown={onMouseDown}
                    onTouchStart={onMouseDown}
                ></canvas>
                <Box
                    position={"relative"}
                    top={-store.templateHeight * scale * CANVAS_ELEMENT_SIZE - CANVAS_ELEMENT_SIZE * scale}
                    width={CANVAS_ELEMENT_SIZE * scale}
                    height={CANVAS_ELEMENT_SIZE * scale}
                    pointerEvents={store.selectedToolIndex === PixelArtTool.stickers ? "all" : "none"}
                >
                    {store.stickers.map((entry: Sticker, index: number) => {
                        return <StickerComponent
                            key={index}
                            store={store}
                            width={CANVAS_ELEMENT_SIZE * scale}
                            height={CANVAS_ELEMENT_SIZE * scale}
                            sticker={entry}
                        />;
                    })}
                </Box>
            </Box>
        </Box>
    );
});

const PALETTE_HEIGHT = "74px";

const PixelsPaletteComponent = observer(({ store }: { store: PixelArtPageStore }) => {
    const { colorMode } = useColorMode();
    const [scale, setScale] = useState(1);

    useEffect(() => {
        setScale(getScale());
    });

    useEffect(() => {
        setScale(getScale());
    }, [AppStore.rwd.isMobile]);

    const getScale = () => {
        return AppStore.rwd.isMobile ? 0.6 : 1;
    };

    return (
        <Box margin={"10px"}>
            <GridItem display={"flex"} flexDirection={"row"} flexGrow={0}>
                <Box display={"flex"} flexDirection={"column"} flexWrap={"wrap"} height={PALETTE_HEIGHT}>
                    {store.palette && store.selectedToolIndex !== PixelArtTool.erase && (
                        <Box boxSize={"64px"} border={"1px solid gray"} bgColor={store.palette[store.selectedBrushPixelIndex]} />
                    )}
                    {store.selectedToolIndex === PixelArtTool.erase && (
                        <Box
                            boxSize={"64px"}
                            border={"1px solid gray"}
                            background={
                                "linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), white"
                            }
                            backgroundRepeat={"repeat, repeat"}
                            backgroundPosition={"0px 0, 8px 8px"}
                            transformOrigin={"0 0 0"}
                            backgroundClip={"border-box, border-box"}
                            backgroundSize={"16px 16px, 16px 16px"}
                        />
                    )}
                    <Box border={"1px solid gray"} m={"3px"} w={"1px"} h={"78%"} marginLeft={"5px"} />
                    <Box w={450 * scale + "px"} overflowX={"auto"} overflowY={"hidden"}>
                        <Box
                            display={"flex"}
                            flexDirection={"column"}
                            flexWrap={"wrap"}
                            alignContent={"flex-start"}
                            height={PALETTE_HEIGHT}
                        >
                            {store.palette?.map((entry: any, index: number) => {
                                return (
                                    <Box
                                        key={index}
                                        p={1}
                                        bg={
                                            store.selectedBrushPixelIndex === index
                                                ? colorMode === "light"
                                                    ? lightModePrimary
                                                    : darkModeSecondary
                                                : "inherit"
                                        }
                                        _hover={{ bg: colorMode === "light" ? lightModePrimary : darkModeSecondary }}
                                        onClick={() => {
                                            store.selectedBrushPixelIndex = index;
                                            store.selectedToolIndex = PixelArtTool.pen;
                                        }}
                                    >
                                        <Box boxSize={"24px"} bgColor={entry} />
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                </Box>
            </GridItem>
        </Box>
    );
});

const ToolsComponent = observer(({ store }: { store: PixelArtPageStore }) => {
    const { colorMode } = useColorMode();

    return (
        <Box margin={"5px"}>
            <GridItem display={"flex"} flexDirection={"column"} flexGrow={0}>
                {pixelArtTools.map((entry: any, index: number) => {
                    return (
                        <Box
                            key={index}
                            p={1}
                            bg={
                                store.selectedToolIndex === index
                                    ? colorMode === "light"
                                        ? lightModePrimary
                                        : darkModeSecondary
                                    : "inherit"
                            }
                            _hover={{ bg: colorMode === "light" ? lightModePrimary : darkModeSecondary }}
                            onClick={() => {
                                store.selectedToolIndex = index;
                            }}
                        >
                            <Icon icon={entry.icon} boxSize={7} fill={lightOrDarkMode(colorMode, "black", "white")} />
                        </Box>
                    );
                })}
                <Box border={"1px solid gray"} m={"3px"} h={"1px"} w={"90%"} marginTop={"5px"} />
                <Box
                    p={1}
                    bg={store.isTemplateVisible ? (colorMode === "light" ? lightModePrimary : darkModeSecondary) : "inherit"}
                    _hover={{ bg: colorMode === "light" ? lightModePrimary : darkModeSecondary }}
                    onClick={() => {
                        store.isTemplateVisible = !store.isTemplateVisible;
                    }}
                >
                    <Icon icon={"templateToggle"} boxSize={7} fill={lightOrDarkMode(colorMode, "black", "white")} />
                </Box>
            </GridItem>
        </Box>
    );
});

const MainMenuComponent = observer(({ store }: { store: PixelArtPageStore }) => {
    const newFile = () => {
        store.newProject();
    };
    const saveFile = () => {
        store.saveProject();
    }
    const undoAction = () => {
        store.undoAction();
    };
    const redoAction = () => {
        store.redoAction();
    };
    const clearCanvas = () => {
        const clearAction = new ClearCanvasAction(store);
        if (clearAction.isValid()) {
            store.pushAction(clearAction);
        }
    };

    const downloadPFP = () => {
        let canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        store.pixelsCanvas.drawStickers(store.stickers);
        var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

        var link = document.getElementById("pfp-link");
        if (link) {
            link.setAttribute("download", "wowsome_pfp.png");
            link.setAttribute("href", image);
            link.click();
        }
        store.pixelsCanvas.updateCanvas();
    };

    const postTweet = () => {
        const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        store.pixelsCanvas.drawStickers(store.stickers);
        const data = canvas.toDataURL().replace("data:image/png;base64,", "");
        store.pixelsCanvas.updateCanvas();
        shareToTwitter(data, "I just created pixel art with my Doge Pixels. Check it out here.", TwitterShareType.Art)
    };

    const importTemplate = () => {
        store.isImportTemplateModalOpened = true;
    };

    const importSticker = () => {
        store.isImportStickerModalOpened = true;
    };

    const generateIdenticon = () => {
        let action = new IdenticonAction(store);
        action.do(store);
        store.pushAction(action);
    };

    const canvasProperties = () => {
        store.isCanvasPropertiesModalOpened = true;
    };

    return (
        <Box>
            <Menu>
                <MenuButton border={"none"} bg={"none"}>
                    <Typography variant={TVariant.PresStart15}>File</Typography>
                </MenuButton>
                <MenuList pt={0}>
                    <MenuItem onClick={newFile}>New File</MenuItem>
                    <MenuItem onClick={saveFile}>Save File</MenuItem>
                    <MenuItem onClick={downloadPFP}>Export</MenuItem>
                    <MenuItem onClick={postTweet}>Share</MenuItem>
                    <MenuItem onClick={importTemplate}>Import Template</MenuItem>
                    <MenuItem onClick={importSticker}>Import Sticker</MenuItem>
                    <MenuItem onClick={generateIdenticon}>Randomize</MenuItem>
                    <MenuItem onClick={canvasProperties}>Properties</MenuItem>
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton border={"none"} bg={"none"}>
                    <Typography variant={TVariant.PresStart15}>Edit</Typography>
                </MenuButton>
                <MenuList pt={0}>
                    <MenuItem disabled={store.undoActions.length === 0} onClick={undoAction}>
                        Undo
                    </MenuItem>
                    <MenuItem disabled={store.redoActions.length === 0} onClick={redoAction}>
                        Redo
                    </MenuItem>
                    <MenuItem onClick={clearCanvas}>Clear</MenuItem>
                </MenuList>
            </Menu>
        </Box>
    );
});

export default PixelArtPage;

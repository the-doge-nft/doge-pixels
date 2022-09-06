import { Box, Grid, GridItem, Menu, MenuButton, MenuItem, MenuList, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo } from "react";
import Pane from "../../DSL/Pane/Pane";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import PixelArtPageStore, { Sticker } from "./PixelArtPage.store";
import Icon from "../../DSL/Icon/Icon";
import { darkModeSecondary, lightModePrimary } from "../../DSL/Theme";
import { ClearCanvasAction, PixelAction } from "./PixelArtActions";
import { PixelArtTool, pixelArtTools } from "./PixelArtTools";
import { TRANSPARENT_PIXEL } from "./PixelArtCanvas";
import ImportTemplateModal from "./ImportTemplateModal/ImportTemplateModal";
import CanvasPropertiesModal from "./CanvasPropertiesModal/CanvasPropertiesModal";
import StickerComponent from "./StickerComponent";
import ImportStickerModal from "./ImportStickerModal/ImportStickerModal";

const CANVAS_ELEMENT_SIZE = 512;

const PixelArtPage = observer(function PixelArtPage() {
    const store = useMemo(() => new PixelArtPageStore(), [])

    useEffect(() => {
        document.addEventListener("keydown", handleHotkeys, false);

        return () => {
            document.removeEventListener("keydown", handleHotkeys);
        };
    });

    const handleHotkeys = (e: KeyboardEvent) => {
        const ctrlPressed = window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey;
        if (ctrlPressed && e.shiftKey && e.code === 'KeyZ') {
            e.preventDefault();
            store.redoAction();
        } else if (ctrlPressed && e.code === 'KeyZ') {
            e.preventDefault();
            store.undoAction();
        }
    }

    return <Pane display={"flex"} flexDirection={"column"} padding={"0px"}>
        <Grid templateColumns={"0fr 1fr"} flexGrow={0}>
            <GridItem display={"flex"} flexDirection={"column"} flexGrow={0}>
                <MainMenuComponent store={store} />
                <Box border={'0.5px solid gray'} mx={'10px'} marginBottom={'5px'} />
                <GridItem display={"flex"} flexDirection={"row"} flexGrow={0}>
                    <ToolsComponent store={store} />
                    {/*<Box h={'97%'} border={'0.5px solid gray'} my={'10px'}/>*/}
                    <ArtCanvasComponent store={store} />
                </GridItem>
                <Box border={'0.5px solid gray'} mx={'10px'} />
                <PixelsPaletteComponent store={store} />
            </GridItem>
        </Grid>
        <a id={'pfp-link'} />
        {store.isImportTemplateModalOpened && <ImportTemplateModal
            store={store}
            isOpen={store.isImportTemplateModalOpened}
            onClose={() => { store.isImportTemplateModalOpened = false; }} />}
        {store.isImportStickerModalOpened && <ImportStickerModal
            store={store}
            isOpen={store.isImportStickerModalOpened}
            onClose={() => { store.isImportStickerModalOpened = false; }} />}
        {store.isCanvasPropertiesModalOpened && <CanvasPropertiesModal
            store={store}
            isOpen={store.isCanvasPropertiesModalOpened}
            onClose={() => { store.isCanvasPropertiesModalOpened = false; }} />}
    </Pane>
});

const ArtCanvasComponent = observer(({ store }: { store: PixelArtPageStore }) => {

    useEffect(() => {
        let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
        store.setCanvas(canvas);
    });

    const updatePixel = (x: number, y: number, action: PixelAction) => {
        let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();
        const canvasCellSize = CANVAS_ELEMENT_SIZE / store.pixelsCanvas.canvasSize;
        if (rect.left < x && rect.right > x &&
            rect.top < y && rect.bottom > y) {
            const canvasX = Math.floor((x - rect.x) / canvasCellSize);
            const canvasY = Math.floor((y - rect.y) / canvasCellSize);
            action.update(store, canvasX, canvasY);
        }
    }

    const onMouseDown = (mouseDownEvent: any) => {
        if (!store.palette || !store.palette.length)
            return;

        const color = pixelArtTools[store.selectedToolIndex].id === PixelArtTool.pen ? store.palette[store.selectedBrushPixelIndex] : TRANSPARENT_PIXEL;
        let action = new PixelAction(color);
        let lastX = mouseDownEvent.clientX;
        let lastY = mouseDownEvent.clientY;
        updatePixel(mouseDownEvent.clientX, mouseDownEvent.clientY, action);

        function onMouseMove(mouseMoveEvent: any) {
            const cn = 10;
            let dx = (mouseMoveEvent.clientX - lastX) / cn;
            let dy = (mouseMoveEvent.clientY - lastY) / cn;
            for (let cd = 0; cd < cn; ++cd) {
                const x = lastX + dx * cd;
                const y = lastY + dy * cd;
                updatePixel(x, y, action);
            }
            lastX = mouseMoveEvent.clientX;
            lastY = mouseMoveEvent.clientY;
        }
        function onMouseUp() {
            if (action.isValid()) {
                store.pushAction(action);
            }

            document.body.removeEventListener("mousemove", onMouseMove);
        }

        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp, { once: true });
    };

    return <Box
        border={"1px solid gray"}
        margin={"5px"}
        background={'linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), white'}
        backgroundRepeat={'repeat, repeat'}
        backgroundPosition={'0px 0, 8px 8px'}
        transformOrigin={'0 0 0'}
        backgroundClip={'border-box, border-box'}
        backgroundSize={'16px 16px, 16px 16px'}
    >
        <Box
            overflow={'hidden'}
            width={CANVAS_ELEMENT_SIZE}
            height={CANVAS_ELEMENT_SIZE}
        >
            <Box
                position={'relative'}
                top={store.templateTop + 'px'}
                left={store.templateLeft + 'px'}
                width={store.templateWidth + 'px'}
                height={store.templateHeight + 'px'}
                backgroundImage={store.templateImage}
                backgroundSize={'contain'}
                backgroundPosition={'center'}
                backgroundRepeat={'no-repeat'}
            >
            </Box>
            <canvas
                style={{
                    position: 'relative',
                    top: -store.templateHeight,
                }}
                id='canvas' width={CANVAS_ELEMENT_SIZE} height={CANVAS_ELEMENT_SIZE} onMouseDown={onMouseDown}>
            </canvas>
            <Box
                position={'relative'}
                top={-store.templateHeight - CANVAS_ELEMENT_SIZE}
                width={CANVAS_ELEMENT_SIZE}
                height={CANVAS_ELEMENT_SIZE}
                pointerEvents={store.selectedToolIndex === PixelArtTool.stickers ? 'all' : 'none'}
            >
                {store.stickers.map((entry: Sticker, index: number) => {
                    return <StickerComponent
                        key={index}
                        store={store}
                        sticker={entry}
                    />
                })}
            </Box>
        </Box>
    </Box>
})

const PALETTE_HEIGHT = '74px';

const PixelsPaletteComponent = observer(({ store }: { store: PixelArtPageStore }) => {
    const { colorMode } = useColorMode()

    return <Box margin={"10px"}>
        <GridItem display={"flex"} flexDirection={"row"} flexGrow={0}>
            <Box display={"flex"} flexDirection={"column"} flexWrap={'wrap'} height={PALETTE_HEIGHT}>
                {store.palette && store.selectedToolIndex !== PixelArtTool.erase && <Box
                    boxSize={'64px'}
                    border={"1px solid gray"}
                    bgColor={store.palette[store.selectedBrushPixelIndex]} />}
                {store.selectedToolIndex === PixelArtTool.erase && <Box
                    boxSize={'64px'}
                    border={"1px solid gray"}
                    background={'linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), white'}
                    backgroundRepeat={'repeat, repeat'}
                    backgroundPosition={'0px 0, 8px 8px'}
                    transformOrigin={'0 0 0'}
                    backgroundClip={'border-box, border-box'}
                    backgroundSize={'16px 16px, 16px 16px'} />}
                <Box border={"1px solid gray"} m={'3px'} w={'1px'} h={'78%'} marginLeft={'5px'} />
                <Box
                    w={'450px'}
                    overflowX={'auto'}
                    overflowY={'hidden'}
                >
                    <Box
                        display={"flex"}
                        flexDirection={"column"}
                        flexWrap={'wrap'}
                        alignContent={'flex-start'}
                        height={PALETTE_HEIGHT}
                    >
                        {store.palette?.map((entry: any, index: number) => {
                            return <Box
                                key={index}
                                p={1}
                                bg={store.selectedBrushPixelIndex === index
                                    ? (colorMode === "light" ? lightModePrimary : darkModeSecondary)
                                    : "inherit"}
                                _hover={{ bg: (colorMode === "light" ? lightModePrimary : darkModeSecondary) }}
                                onClick={() => {
                                    store.selectedBrushPixelIndex = index;
                                    store.selectedToolIndex = PixelArtTool.pen;
                                }}
                            >
                                <Box boxSize={'24px'} bgColor={entry} />
                            </Box>
                        })}
                    </Box>
                </Box>
            </Box>
        </GridItem>
    </Box>
})

const ToolsComponent = observer(({ store }: { store: PixelArtPageStore }) => {
    const { colorMode } = useColorMode()

    return <Box margin={"5px"}>
        <GridItem display={"flex"} flexDirection={"column"} flexGrow={0}>
            {pixelArtTools.map((entry: any, index: number) => {
                return <Box
                    key={index}
                    p={1}
                    bg={store.selectedToolIndex === index
                        ? (colorMode === "light" ? lightModePrimary : darkModeSecondary)
                        : "inherit"}
                    _hover={{ bg: (colorMode === "light" ? lightModePrimary : darkModeSecondary) }}
                    onClick={() => {
                        store.selectedToolIndex = index;
                    }}
                >
                    <Icon icon={entry.icon} boxSize={6} />
                </Box>
            })}
        </GridItem>
    </Box>
})

const MainMenuComponent = observer(({ store }: { store: PixelArtPageStore }) => {
    const undoAction = () => {
        store.undoAction();
    }
    const redoAction = () => {
        store.redoAction();
    }
    const clearCanvas = () => {
        const clearAction = new ClearCanvasAction(store);
        if (clearAction.isValid()) {
            store.pushAction(clearAction);
        }
    }
    const downloadPFP = () => {
        let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
        //store.pixelsCanvas.drawStickers(store.stickers);
        var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

        var link = document.getElementById('pfp-link');
        if (link) {
            link.setAttribute('download', 'wowsome_pfp.png');
            link.setAttribute('href', image);
            link.click();
        }
        store.pixelsCanvas.updateCanvas();
    }

    const postTweet = () => {
        const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
        const data = canvas.toDataURL().replace('data:image/png;base64,', '');
        fetch('https://prod.hmstrs.com/twitter/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data,
                ext: 'png',
            })
        }).then(response => response.json()).then(data => {
            if (data && data.id && data.location) {
                const message = 'I just created pixel art with my doge pixels, check it out here';
                const screenshotUrl = 'https://prod.hmstrs.com/twitter/' + data.id;
                const text = encodeURIComponent(`${message}\n${screenshotUrl}`);
                window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
            }
        }).catch((err) => {
            console.error(err);
        });;
    }

    const importTemplate = () => {
        store.isImportTemplateModalOpened = true;
    }

    const importSticker = () => {
        store.isImportStickerModalOpened = true;
    }

    const generateIdenticon = () => {
        store.pixelsCanvas.generateIdenticon(store.selectedAddress, store.palette);
    }

    const canvasProperties = () => {
        store.isCanvasPropertiesModalOpened = true;
    }

    return <Box>
        <Menu>
            <MenuButton
                border={'none'}
                bg={'none'}>
                <Typography variant={TVariant.PresStart15}>
                    File
                </Typography>
            </MenuButton>
            <MenuList pt={0}>
                <MenuItem>New File</MenuItem>
                <MenuItem>Save File</MenuItem>
                <MenuItem onClick={downloadPFP}>Export</MenuItem>
                <MenuItem onClick={postTweet}>Share</MenuItem>
                <MenuItem onClick={importTemplate}>Import Template</MenuItem>
                <MenuItem onClick={importSticker}>Import Sticker</MenuItem>
                <MenuItem onClick={generateIdenticon}>Randomize</MenuItem>
                <MenuItem onClick={canvasProperties}>Properties</MenuItem>
            </MenuList>
        </Menu>
        <Menu>
            <MenuButton
                border={'none'}
                bg={'none'}>
                <Typography variant={TVariant.PresStart15}>
                    Edit
                </Typography>
            </MenuButton>
            <MenuList pt={0}>
                <MenuItem disabled={store.undoActions.length === 0} onClick={undoAction}>Undo</MenuItem>
                <MenuItem disabled={store.redoActions.length === 0} onClick={redoAction}>Redo</MenuItem>
                <MenuItem onClick={clearCanvas}>Clear</MenuItem>
            </MenuList>
        </Menu>
    </Box>
})

export default PixelArtPage;

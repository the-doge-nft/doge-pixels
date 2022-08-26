import { Box, Grid, GridItem, Menu, MenuButton, MenuItem, MenuList, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import Pane from "../../DSL/Pane/Pane";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import PixelArtPageStore from "./PixelArtPage.store";
import Icon from "../../DSL/Icon/Icon";
import { darkModeSecondary, lightModePrimary } from "../../DSL/Theme";
import { ClearAction, PixelAction } from "./PixelArtActions";
import { PixelArtTool, pixelArtTools } from "./PixelArtTools";
import { TRANSPARENT_PIXEL } from "./PixelArtCanvas";
import ImportTemplateModal from "./ImportTemplateModal/ImportTemplateModal";

const CANVAS_ELEMENT_SIZE = 512;

const PixelArtPage = observer(function PixelArtPage() {
    const store = useMemo(() => new PixelArtPageStore(), [])

    useEffect(() => {
        document.addEventListener("keydown", handleHotkeys, false);
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
        <Typography variant={TVariant.PresStart10} m={2}>
            {store.selectedAddress}
        </Typography>
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
    </Pane>
});

const ArtCanvasComponent = observer(({ store }: { store: PixelArtPageStore }) => {
    const [mousePressed, setMousePressed] = useState(false);
    const [lastCoords, setLastCoords] = useState<number[]>([0, 0]);
    const [activeAction, setActiveAction] = useState<PixelAction | null>(null);

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
            action.update(store.pixelsCanvas, canvasX, canvasY);
        }
    }

    const onCanvasMouseMove = (e: any) => {
        if (mousePressed && activeAction) {
            const cn = 10;
            let dx = (e.clientX - lastCoords[0]) / cn;
            let dy = (e.clientY - lastCoords[1]) / cn;
            for (let cd = 0; cd < cn; ++cd) {
                const x = lastCoords[0] + dx * cd;
                const y = lastCoords[1] + dy * cd;
                updatePixel(x, y, activeAction);
            }
            setLastCoords([e.clientX, e.clientY]);
        }
    }

    const onCanvasMouseDown = (e: any) => {
        const color = pixelArtTools[store.selectedToolIndex].id === PixelArtTool.pen ? store.palette[store.selectedBrushPixelIndex] : TRANSPARENT_PIXEL;
        let action = new PixelAction(color);
        setActiveAction(action);
        updatePixel(e.clientX, e.clientY, action);
        setLastCoords([e.clientX, e.clientY]);
        setMousePressed(true);
    }

    const onCanvasMouseUp = (e: any) => {
        if (activeAction && activeAction.isValid()) {
            store.pushAction(activeAction);
        }
        setActiveAction(null);
        setMousePressed(false);
    }

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
            backgroundImage={store.backgroundImage}
            backgroundSize={'contain'}
            backgroundPosition={'center'}
            backgroundRepeat={'no-repeat'}
        >
            <canvas id='canvas' width={CANVAS_ELEMENT_SIZE} height={CANVAS_ELEMENT_SIZE} onMouseMove={(e) => onCanvasMouseMove(e)} onMouseDown={e => onCanvasMouseDown(e)} onMouseUp={e => onCanvasMouseUp(e)} onMouseLeave={e => onCanvasMouseUp(e)} />
        </Box>
    </Box>
})

const PixelsPaletteComponent = observer(({ store }: { store: PixelArtPageStore }) => {
    const { colorMode } = useColorMode()

    return <Box margin={"10px"}>
        <GridItem display={"flex"} flexDirection={"row"} flexGrow={0}>
            <Box display={"flex"} flexDirection={"column"} flexWrap={'wrap'} height={70}>
                {store.palette && store.selectedToolIndex === PixelArtTool.pen && <Box
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
                <Box border={"1px solid gray"} m={'3px'} w={'1px'} h={'84%'} marginLeft={'5px'} />
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
        const clearAction = new ClearAction(store.pixelsCanvas);
        if (clearAction.isValid()) {
            store.pushAction(clearAction);
        }
    }
    const downloadPFP = () => {
        let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
        var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

        var link = document.getElementById('pfp-link');
        if (link) {
            link.setAttribute('download', 'wowsome_pfp.png');
            link.setAttribute('href', image);
            link.click();
        }
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
            console.log('twitter upload', data);
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

    const generateIdenticon = () => {
        store.pixelsCanvas.generateIdenticon(store.selectedAddress, store.palette);
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
                <MenuItem onClick={importTemplate}>Import</MenuItem>
                <MenuItem onClick={generateIdenticon}>Randomize</MenuItem>
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

import { Box, Grid, GridItem, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import Pane from "../../DSL/Pane/Pane";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import PixelArtPageStore, { ActionInterface, EraseAction, PenAction, PixelArtTool } from "./PixelArtPage.store";
import Icon from "../../DSL/Icon/Icon";
import { darkModeSecondary, lightModePrimary } from "../../DSL/Theme";

const CANVAS_ELEMENT_SIZE = 512;

const PixelArtPage = observer(function PixelArtPage() {
    const store = useMemo(() => new PixelArtPageStore(), [])

    useEffect(() => {
        console.log(store.selectedDogs);
    }, []);

    return <Pane display={"flex"} flexDirection={"column"} h={"full"} padding={"0px"}>
        <Typography variant={TVariant.PresStart10} m={2}>
            {store.selectedAddress}
        </Typography>
        <Grid templateColumns={"0.5fr 1fr"} flexGrow={1}>
            <GridItem display={"flex"} flexDirection={"column"} flexGrow={1}>
                <MainMenu store={store} />
                <GridItem display={"flex"} flexDirection={"row"} flexGrow={1}>
                    <ToolBar store={store} />
                    <ArtCanvas store={store} />
                </GridItem>
                <PixelPalette store={store} />
            </GridItem>
        </Grid>
    </Pane>
});

const ArtCanvas = observer(({ store }: { store: PixelArtPageStore }) => {
    const [mousePressed, setMousePressed] = useState(false);

    useEffect(() => {
        let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
        updateCanvas(canvas);
    }, [store.tick]);

    const updateCanvas = (canvas: HTMLCanvasElement) => {
        let ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cellSize = CANVAS_ELEMENT_SIZE / store.canvasSize;

        ctx.save();
        ctx.clearRect(0, 0, CANVAS_ELEMENT_SIZE, CANVAS_ELEMENT_SIZE);
        for (let cy = 0; cy < store.canvasSize; ++cy) {
            for (let cx = 0; cx < store.canvasSize; ++cx) {
                ctx.fillStyle = store.canvasPixels[cx + cy * store.canvasSize];
                ctx.fillRect(cx * cellSize, cy * cellSize, cellSize, cellSize);
            }
        }
        ctx.restore();
    }

    const updatePixel = (x: number, y: number) => {
        let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();
        const canvasCellSize = CANVAS_ELEMENT_SIZE / store.canvasSize;
        if (rect.left < x && rect.right > x &&
            rect.top < y && rect.bottom > y) {
            const canvasPixelX = Math.floor((x - rect.x) / canvasCellSize);
            const canvasPixelY = Math.floor((y - rect.y) / canvasCellSize);

            if (store.tools[store.selectedToolIndex].id === PixelArtTool.pen) {
                if (store.palette[store.selectedBrushPixelIndex] !== store.getPixelColor(canvasPixelX, canvasPixelY)) {
                    store.doAction(new PenAction(canvasPixelX, canvasPixelY, store.palette[store.selectedBrushPixelIndex]));
                }
            } else {
                if ('#00000000' !== store.getPixelColor(canvasPixelX, canvasPixelY)) {
                    store.doAction(new EraseAction(canvasPixelX, canvasPixelY));
                }
            }
        }
    }

    const onCanvasMouseMove = (e: any) => {
        if (mousePressed) {
            updatePixel(e.clientX, e.clientY);
        }
    }

    const onCanvasMouseDown = (e: any) => {
        updatePixel(e.clientX, e.clientY);
        setMousePressed(true);
    }

    const onCanvasMouseUp = (e: any) => {
        setMousePressed(false);
    }

    return <Box
        border={"1px dashed black"}
        margin={"5px"}
        background={'linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), white'}
        backgroundRepeat={'repeat, repeat'}
        backgroundPosition={'0px 0, 5px 5px'}
        transformOrigin={'0 0 0'}
        //backgroundOrigin={'padding-box, padding-box'}
        backgroundClip={'border-box, border-box'}
        backgroundSize={'10px 10px, 10px 10px'}
    >
        <canvas id='canvas' width={CANVAS_ELEMENT_SIZE} height={CANVAS_ELEMENT_SIZE} onMouseMove={(e) => onCanvasMouseMove(e)} onMouseDown={e => onCanvasMouseDown(e)} onMouseUp={e => onCanvasMouseUp(e)} />
    </Box>
})

const PixelPalette = observer(({ store }: { store: PixelArtPageStore }) => {
    const { colorMode } = useColorMode()

    return <Box margin={"5px"} border={"1px dashed black"}>
        <GridItem display={"flex"} flexDirection={"row"} flexGrow={1}>
            <Grid templateColumns='repeat(2, 0fr)'>
                {/*store.brushPixels.map((entry: any, index: number) => {
                    return <Box
                        key={index}
                        p={1}
                        bg={store.selectedBrushPixelIndex === index
                            ? (colorMode === "light" ? lightModePrimary : darkModeSecondary)
                            : "inherit"}
                        _hover={{ bg: (colorMode === "light" ? lightModePrimary : darkModeSecondary) }}
                        onClick={() => {
                            store.selectedBrushPixelIndex = index;
                        }}
                    >
                        <Box boxSize={6} bgColor={entry} />
                    </Box>
                })*/}
                {store.palette.map((entry: any, index: number) => {
                    return <Box
                        key={index}
                        p={1}
                        bg={store.selectedBrushPixelIndex === index
                            ? (colorMode === "light" ? lightModePrimary : darkModeSecondary)
                            : "inherit"}
                        _hover={{ bg: (colorMode === "light" ? lightModePrimary : darkModeSecondary) }}
                        onClick={() => {
                            store.selectedBrushPixelIndex = index;
                        }}
                    >
                        <Box boxSize={6} bgColor={entry} />
                    </Box>
                })}
            </Grid>
        </GridItem>
    </Box>
})

const ToolBar = observer(({ store }: { store: PixelArtPageStore }) => {
    const { colorMode } = useColorMode()

    return <Box margin={"5px"}>
        <GridItem display={"flex"} flexDirection={"column"} flexGrow={1}>
            {store.tools.map((entry: any, index: number) => {
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

const MainMenu = observer(({ store }: { store: PixelArtPageStore }) => {
    const undoAction = () => {
        store.undoAction();
    }
    const redoAction = () => {
        store.redoAction();
    }

    return <Box>
        <Menu>
            <MenuButton
                border={'none'}>
                <Typography variant={TVariant.PresStart15}>
                    File
                </Typography>
            </MenuButton>
            <MenuList>
                <MenuItem>New File</MenuItem>
                <MenuItem>New Window</MenuItem>
                <MenuDivider />
                <MenuItem>Open...</MenuItem>
                <MenuItem>Save File</MenuItem>
            </MenuList>
        </Menu>
        <Menu>
            <MenuButton
                border={'none'}>
                <Typography variant={TVariant.PresStart15}>
                    Edit
                </Typography>
            </MenuButton>
            <MenuList>
                <MenuItem disabled={store.undoActions.length === 0} onClick={undoAction}>Undo</MenuItem>
                <MenuItem disabled={store.redoActions.length === 0} onClick={redoAction}>Redo</MenuItem>
            </MenuList>
        </Menu>
        <Menu>
            <MenuButton
                border={'none'}>
                <Typography variant={TVariant.PresStart15}>
                    Share
                </Typography>
            </MenuButton>
            <MenuList>
                <MenuItem>Undo</MenuItem>
                <MenuItem>Redo</MenuItem>
            </MenuList>
        </Menu>
    </Box>
})

export default PixelArtPage;

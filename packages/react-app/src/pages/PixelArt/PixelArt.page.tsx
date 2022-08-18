import { Box, Grid, GridItem, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import Pane from "../../DSL/Pane/Pane";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import PixelArtPageStore, { EraseAction, PenAction, PixelArtTool, TRANSPARENT_PIXEL } from "./PixelArtPage.store";
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
                <Box w={'100%'} border={'0.5px solid black'} mx={'10px'} marginBottom={'5px'} />
                <GridItem display={"flex"} flexDirection={"row"} flexGrow={1}>
                    <ToolBar store={store} />
                    {/*<Box h={'97%'} border={'0.5px solid black'} my={'10px'}/>*/}
                    <ArtCanvas store={store} />
                </GridItem>
                <Box w={'100%'} border={'0.5px solid black'} mx={'10px'} />
                <PixelPalette store={store} />
            </GridItem>
        </Grid>
        <a id={'pfp-link'} />
    </Pane>
});

const ArtCanvas = observer(({ store }: { store: PixelArtPageStore }) => {
    const [mousePressed, setMousePressed] = useState(false);
    const [lastCoords, setLastCoords] = useState<number[]>([0, 0]);

    useEffect(() => {
        let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
        store.setCanvas(canvas);
    }, []);

    const updatePixel = (x: number, y: number) => {
        let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();
        const canvasCellSize = CANVAS_ELEMENT_SIZE / store.canvasSize;
        if (rect.left < x && rect.right > x &&
            rect.top < y && rect.bottom > y) {
            const canvasPixelX = Math.floor((x - rect.x) / canvasCellSize);
            const canvasPixelY = Math.floor((y - rect.y) / canvasCellSize);

            if (store.tools[store.selectedToolIndex].id === PixelArtTool.pen) {
                if (!store.isSamePixel(canvasPixelX, canvasPixelY, store.palette[store.selectedBrushPixelIndex])) {
                    store.doAction(new PenAction(canvasPixelX, canvasPixelY, store.palette[store.selectedBrushPixelIndex]));
                }
            } else {
                if (!store.isSamePixel(canvasPixelX, canvasPixelY, TRANSPARENT_PIXEL)) {
                    store.doAction(new EraseAction(canvasPixelX, canvasPixelY));
                }
            }
        }
    }

    const onCanvasMouseMove = (e: any) => {
        if (mousePressed) {
            const cn = 10;
            let dx = (e.clientX - lastCoords[0]) / cn;
            let dy = (e.clientY - lastCoords[1]) / cn;
            for(let cd = 0; cd < cn; ++cd) {
                const x = lastCoords[0] + dx * cd;
                const y = lastCoords[1] + dy * cd;
                updatePixel(x, y);
            }
            setLastCoords([e.clientX, e.clientY]);
        }
    }

    const onCanvasMouseDown = (e: any) => {
        updatePixel(e.clientX, e.clientY);
        setLastCoords([e.clientX, e.clientY]);
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

    return <Box margin={"10px"}>
        <GridItem display={"flex"} flexDirection={"row"} flexGrow={1}>
            <Box display={"flex"} flexDirection={"column"} flexWrap={'wrap'} height={70}>
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
                {store.palette && <Box boxSize={'64px'} bgColor={store.palette[store.selectedBrushPixelIndex]} />}
                <Box border={"1px solid black"} m={'3px'} w={'1px'} h={'84%'} marginLeft={'5px'}/>
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
                        }}
                    >
                        <Box boxSize={'24px'} bgColor={entry} />
                    </Box>
                })}
            </Box>
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
                <MenuItem onClick={downloadPFP}>Download as PFP</MenuItem>
                <MenuItem onClick={postTweet}>Tweet</MenuItem>
            </MenuList>
        </Menu>
    </Box>
})

export default PixelArtPage;

import { observer } from "mobx-react-lite";
import Modal from "../../../DSL/Modal/Modal";
import { Box } from "@chakra-ui/react";
import PixelArtPageStore from "../PixelArtPage.store";
import Button, { ButtonVariant } from "../../../DSL/Button/Button";
import DragResizeComponent from "../DragResizeComponent";
import { useEffect, useState } from "react";
import Select from "../../../DSL/Select/Select";
import Typography, { TVariant } from "../../../DSL/Typography/Typography";

const CANVAS_ELEMENT_SIZE = 256;
const CANVAS_ELEMENT_MARGIN = 80;
const SCALE_FACTOR = 2;

const ITEMS = [
    {
        id: 'S',
        name: 'S',
    },
    {
        id: 'M',
        name: 'M',
    },
    {
        id: 'L',
        name: 'L',
    },
    {
        id: 'XL',
        name: 'XL',
    },
];

interface CanvasPropertiesModalProps {
    isOpen: boolean;
    onClose: () => void;
    store: PixelArtPageStore;
}

const CanvasPropertiesModal = observer((props: CanvasPropertiesModalProps) => {
    const [left, setLeft] = useState(props.store.templateLeft);
    const [top, setTop] = useState(props.store.templateTop);
    const [width, setWidth] = useState(props.store.templateWidth);
    const [height, setHeight] = useState(props.store.templateHeight);
    const [backgroundPos, setBackgroundPos] = useState('');
    const [backgroundSize, setBackgroundSize] = useState('');
    const [canvasSize, setCanvasSize] = useState('S');

    useEffect(() => {
        const cellSize = CANVAS_ELEMENT_SIZE / props.store.pixelsCanvas.canvasSize;
        setBackgroundPos(`0px 0px, ${cellSize}px ${cellSize}px`);
        setBackgroundSize(`${cellSize * 2}px ${cellSize * 2}px, ${cellSize * 2}px ${cellSize * 2}px`);
    });

    const onApply = () => {
        props.store.templateLeft = left;
        props.store.templateTop = top;
        props.store.templateWidth = width;
        props.store.templateHeight = height;
        props.onClose();
    }

    const onReset = () => {
        props.onClose();
    }

    const onDrag = (left: number, top: number, width: number, height: number) => {
        setLeft(left * SCALE_FACTOR);
        setTop(top * SCALE_FACTOR);
        setWidth(width * SCALE_FACTOR);
        setHeight(height * SCALE_FACTOR);
    }

    return <Modal
        size={"lg"}
        isOpen={props.isOpen}
        onClose={props.onClose}
        title={'Canvas Properties'}
    >
        <Box pt={5} pb={6}>
            <Box display={'flex'} justifyContent={'space-evenly'} alignItems={'center'}>
                <Typography variant={TVariant.PresStart15}>
                    Canvas Size:
                </Typography>
                <Box w={'150px'}>
                    <Select items={ITEMS} value={canvasSize} onChange={(value: any) => { setCanvasSize(value) }} />
                </Box>
            </Box>
            <Box
                width={CANVAS_ELEMENT_SIZE + CANVAS_ELEMENT_MARGIN * 2} 
                height={CANVAS_ELEMENT_SIZE + CANVAS_ELEMENT_MARGIN * 2}
                margin={'10px auto'}
                overflow={'hidden'}
                border={"1px dotted gray"}
                >
                <Box
                    position={'relative'}
                    width={CANVAS_ELEMENT_SIZE + 'px'} 
                    height={CANVAS_ELEMENT_SIZE + 'px'}
                    top={CANVAS_ELEMENT_MARGIN + 'px'} 
                    left={CANVAS_ELEMENT_MARGIN + 'px'}
                >
                    <DragResizeComponent
                        image={props.store.templateImage}
                        top={props.store.templateTop / SCALE_FACTOR}
                        left={props.store.templateLeft / SCALE_FACTOR}
                        width={props.store.templateWidth / SCALE_FACTOR}
                        height={props.store.templateHeight / SCALE_FACTOR}
                        maxWidth={CANVAS_ELEMENT_SIZE + CANVAS_ELEMENT_MARGIN * 2}
                        maxHeight={CANVAS_ELEMENT_SIZE + CANVAS_ELEMENT_MARGIN * 2}
                        onChange={onDrag} />
                    <Box
                        border={"1px solid gray"}
                        background={'linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), rgba(1, 1, 1, 0)'}
                        backgroundRepeat={'repeat, repeat'}
                        backgroundPosition={backgroundPos}
                        transformOrigin={'0 0 0'}
                        backgroundClip={'border-box, border-box'}
                        backgroundSize={backgroundSize}
                        position={'relative'}
                        width={CANVAS_ELEMENT_SIZE} height={CANVAS_ELEMENT_SIZE}
                        top={-height / SCALE_FACTOR}
                        pointerEvents={'none'}
                    >
                    </Box>
                </Box>
            </Box>
            <Box
                display={'flex'}
                justifyContent={'center'}
            >
                <Button p={0} margin={'0 auto'} variant={ButtonVariant.Primary} onClick={onApply}>Apply</Button>
                <Button p={0} margin={'0 auto'} variant={ButtonVariant.Primary} onClick={onReset}>Cancel</Button>
            </Box>
        </Box>
    </Modal >
})

export default CanvasPropertiesModal

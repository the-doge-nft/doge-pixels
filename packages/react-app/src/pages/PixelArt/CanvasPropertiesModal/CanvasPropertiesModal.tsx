import { observer } from "mobx-react-lite";
import Modal from "../../../DSL/Modal/Modal";
import { Box } from "@chakra-ui/react";
import PixelArtPageStore from "../PixelArtPage.store";
import Button, { ButtonVariant } from "../../../DSL/Button/Button";
import DragResizeComponent from "../DragResizeComponent";
import { useEffect, useState } from "react";

const CANVAS_ELEMENT_SIZE = 256;
const SCALE_FACTOR = 2;

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
        <Box pt={0} pb={6}>
            <Box
                width={CANVAS_ELEMENT_SIZE * 2} height={CANVAS_ELEMENT_SIZE * 2}
            >
                <Box
                    position={'relative'}
                    width={CANVAS_ELEMENT_SIZE} height={CANVAS_ELEMENT_SIZE}
                    top={CANVAS_ELEMENT_SIZE / 2} left={CANVAS_ELEMENT_SIZE / 2}
                >
                    <DragResizeComponent
                        image={props.store.templateImage}
                        top={props.store.templateTop / SCALE_FACTOR}
                        left={props.store.templateLeft / SCALE_FACTOR}
                        width={props.store.templateWidth / SCALE_FACTOR}
                        height={props.store.templateHeight / SCALE_FACTOR}
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
            <Button p={0} variant={ButtonVariant.Primary} onClick={onApply}>Apply</Button>
            <Button p={0} variant={ButtonVariant.Primary} onClick={onReset}>Reset</Button>
        </Box>
    </Modal >
})

export default CanvasPropertiesModal

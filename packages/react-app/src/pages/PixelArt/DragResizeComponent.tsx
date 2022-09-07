import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";

const SAFE_ZONE = 20;
const MIN_SIZE = 50;

interface DragResizeComponentProps {
    image?: string;
    top: number;
    left: number;
    width: number;
    height: number;
    maxWidth: number;
    maxHeight: number;
    onChange?: (left: number, top: number, width: number, height: number) => void;
}

const DragResizeComponent = observer(function DragResizeComponent(props: DragResizeComponentProps) {
    const [position, setPosition] = useState({ x: props.left, y: props.top });
    const [size, setSize] = useState({ x: props.width, y: props.height });

    const onMouseDown = (mouseDownEvent: any) => {
        const startSize = size;
        const startPosition = position;
        
        let rect = mouseDownEvent.target.getBoundingClientRect();
        let clientX = mouseDownEvent.clientX - rect.x;
        let clientY = mouseDownEvent.clientY - rect.y;
        let cornerX = 0;
        let cornerY = 0;

        if (clientX < SAFE_ZONE) cornerX = -1;
        if (clientX >= rect.width - SAFE_ZONE) cornerX = 1;
        if (clientY < SAFE_ZONE) cornerY = -1;
        if (clientY >= rect.height - SAFE_ZONE) cornerY = 1;

        const capture = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };

        function onMouseMove(mouseMoveEvent: any) {
            let dx = capture.x - mouseMoveEvent.pageX;
            let dy = capture.y - mouseMoveEvent.pageY;
            let x = startPosition.x;
            let y = startPosition.y;
            let w = startSize.x;
            let h = startSize.y;

            if (cornerX !== 0 && cornerY === 0) dy = 0;
            if (cornerX === 0 && cornerY !== 0) dx = 0;

            if (cornerX === 1) w -= dx;
            if (cornerY === 1) h -= dy;
            if (cornerX === -1) w += dx;
            if (cornerY === -1) h += dy;
            if (cornerX === -1) x -= dx;
            if (cornerY === -1) y -= dy;
            if (cornerX === 0) x -= dx;
            if (cornerY === 0) y -= dy;

            setPosition(value => ({
                x: x,
                y: y,
            }))
            w = Math.min(w, props.maxWidth);
            h = Math.min(h, props.maxHeight);
            setSize(value => ({
                x: w,
                y: h,
            }));
            if (props.onChange) {
                props.onChange(x, y, w, h);
            }
        }
        function onMouseUp() {
            document.body.removeEventListener("mousemove", onMouseMove);
        }

        document.body.addEventListener("mousemove", onMouseMove);
        document.body.addEventListener("mouseup", onMouseUp, { once: true });
    };

    return <Box
        id='drag-resize'
        key='drag-resize'
        position={'relative'}
        style={{
            left: position.x,
            top: position.y,
            width: size.x,
            height: size.y,
            minWidth: MIN_SIZE,
            minHeight: MIN_SIZE,
        }}
        w={100}
        h={100}
        bgColor={'#F008'}
        onMouseDown={onMouseDown}
        backgroundImage={props.image}
        backgroundSize={'contain'}
        backgroundPosition={'center'}
        backgroundRepeat={'no-repeat'}
    >
    </Box>
});

export default DragResizeComponent;

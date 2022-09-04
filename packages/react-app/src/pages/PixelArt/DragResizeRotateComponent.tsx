import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";

const SAFE_ZONE = 20;
const MIN_SIZE = 50;

interface DragResizeRotateComponentProps {
    image?: string;
    top: number;
    left: number;
    width: number;
    height: number;
    rotation: number;
    onChange?: (left: number, top: number, width: number, height: number, rotation: number) => void;
}

const DragResizeRotateComponent = observer(function DragResizeComponent(props: DragResizeRotateComponentProps) {
    const [position, setPosition] = useState({ x: props.left, y: props.top });
    const [size, setSize] = useState({ x: props.width, y: props.height });
    const [rotation, setRotation] = useState(props.rotation);
    const [rotationStr, setRotationStr] = useState(`rotate(${props.rotation}deg)`)

    const onMouseDown = (mouseDownEvent: any) => {
        const startSize = size;
        const startPosition = position;

        let rect = mouseDownEvent.target.getBoundingClientRect();
        let clientX = mouseDownEvent.clientX - rect.x - rect.width / 2;
        let clientY = mouseDownEvent.clientY - rect.y - rect.height / 2;

        const captureVector = {
            x: clientX,
            y: clientY,
        };
        let startLength = Math.sqrt(captureVector.x * captureVector.x + captureVector.y * captureVector.y);
        let rotationVector = {
            x: captureVector.x / startLength,
            y: captureVector.y / startLength,
        }
        const startAngle = Math.atan2(rotationVector.y, rotationVector.x);

        const b = -rotation / 180 * Math.PI;

        let rotX = Math.cos(b) * clientX - Math.sin(b) * clientY;
        let rotY = Math.sin(b) * clientX + Math.cos(b) * clientY;

        let isCorner = false;
        if (Math.abs(rotX) >= startSize.x / 2 - SAFE_ZONE) isCorner = true;
        if (Math.abs(rotY) >= startSize.y / 2 - SAFE_ZONE) isCorner = true;

        const capture = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };

        function onMouseMove(mouseMoveEvent: any) {
            let dx = capture.x - mouseMoveEvent.pageX;
            let dy = capture.y - mouseMoveEvent.pageY;

            let x = startPosition.x;
            let y = startPosition.y;
            let w = startSize.x;
            let h = startSize.y;
            let a = rotation;

            if (isCorner) {
                const moveVector = {
                    x: captureVector.x - dx,
                    y: captureVector.y - dy,
                }
                let moveLength = Math.sqrt(moveVector.x * moveVector.x + moveVector.y * moveVector.y);
                rotationVector = {
                    x: moveVector.x / moveLength,
                    y: moveVector.y / moveLength,
                }
                const angle = Math.atan2(rotationVector.y, rotationVector.x);
                a += (angle - startAngle) / Math.PI * 180;
        
                let dw = (moveLength - startLength) / startLength * w;
                let dh = (moveLength - startLength) / startLength * h;
                w += dw;
                h += dh;
                x -= dw / 2;
                y -= dh / 2;
            } else {
                x -= dx;
                y -= dy;
            }

            setPosition(value => ({
                x: x,
                y: y,
            }))
            setSize(value => ({
                x: w,
                y: h,
            }));
            setRotation(value => (a));
            setRotationStr(value => (`rotate(${a}deg)`));
            if (props.onChange) {
                props.onChange(x, y, w, h, a);
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
        position={'absolute'}
        style={{
            left: position.x,
            top: position.y,
            width: size.x,
            height: size.y,
            minWidth: MIN_SIZE,
            minHeight: MIN_SIZE,
            transform: rotationStr
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

export default DragResizeRotateComponent;

import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import Icon from "../../DSL/Icon/Icon";
import { ChangeStickerAction, RemoveStickerAction } from "./PixelArtActions";
import PixelArtPageStore, { Sticker } from "./PixelArtPage.store";
import { PixelArtTool } from "./PixelArtTools";

const SAFE_ZONE = 20;
const MIN_SIZE = 50;

interface StickerComponentProps {
  sticker: Sticker;
  width: number;
  height: number;
  store: PixelArtPageStore;
}

const StickerComponent = observer(function StickerComponent(props: StickerComponentProps) {
  const [position, setPosition] = useState({ x: props.sticker.x, y: props.sticker.y });
  const [size, setSize] = useState({ x: props.sticker.width, y: props.sticker.height });
  const [rotation, setRotation] = useState(props.sticker.rotation);
  const [rotationStr, setRotationStr] = useState(`rotate(${props.sticker.rotation}deg)`);

  useEffect(() => {
    //console.log('StickerComponent.useEffect', props.store.stickersHack);
    setPosition({ x: props.sticker.x, y: props.sticker.y });
    setSize({ x: props.sticker.width, y: props.sticker.height });
    setRotation(props.sticker.rotation);
    setRotationStr(`rotate(${props.sticker.rotation}deg)`);
  }, [props.store.stickersHack, props.sticker]);

  const onMouseDown = (mouseDownEvent: any) => {
    let action: any = null;

    let clientX = mouseDownEvent.clientX;
    let clientY = mouseDownEvent.clientY;
    let pageX = mouseDownEvent.pageX;
    let pageY = mouseDownEvent.pageY;

    if (mouseDownEvent.changedTouches) {
      let ourTouch = false;
      for (let touch of mouseDownEvent.changedTouches) {
        if (touch.identifier === 0) {
          clientX = touch.clientX;
          clientY = touch.clientY;
          pageX = touch.pageX;
          pageY = touch.pageY;
          ourTouch = true;
          break;
        }
      }
      if (!ourTouch) return;
    }

    const startSize = { x: size.x * props.width, y: size.y * props.height };
    const startPosition = { x: position.x * props.width, y: position.y * props.height };

    let rect = mouseDownEvent.target.getBoundingClientRect();
    clientX = clientX - rect.x - rect.width / 2;
    clientY = clientY - rect.y - rect.height / 2;

    const captureVector = {
      x: clientX,
      y: clientY,
    };
    let startLength = Math.sqrt(captureVector.x * captureVector.x + captureVector.y * captureVector.y);
    let rotationVector = {
      x: captureVector.x / startLength,
      y: captureVector.y / startLength,
    };
    const startAngle = Math.atan2(rotationVector.y, rotationVector.x);

    const b = (-rotation / 180) * Math.PI;

    let rotX = Math.cos(b) * clientX - Math.sin(b) * clientY;
    let rotY = Math.sin(b) * clientX + Math.cos(b) * clientY;

    let isCorner = false;
    if (Math.abs(rotX) >= startSize.x / 2 - SAFE_ZONE) isCorner = true;
    if (Math.abs(rotY) >= startSize.y / 2 - SAFE_ZONE) isCorner = true;

    const capture = { x: pageX, y: pageY };

    function onMouseMove(mouseMoveEvent: any) {
      let pageX = mouseMoveEvent.pageX;
      let pageY = mouseMoveEvent.pageY;

      if (mouseMoveEvent.changedTouches) {
        let ourTouch = false;
        for (let touch of mouseMoveEvent.changedTouches) {
          if (touch.identifier === 0) {
            clientX = touch.clientX;
            clientY = touch.clientY;
            pageX = touch.pageX;
            pageY = touch.pageY;
            ourTouch = true;
            break;
          }
        }
        if (!ourTouch) return;
      }

      if (!action) {
        action = new ChangeStickerAction(props.sticker);
      }

      let dx = capture.x - pageX;
      let dy = capture.y - pageY;

      let x = startPosition.x;
      let y = startPosition.y;
      let w = startSize.x;
      let h = startSize.y;
      let a = rotation;

      if (isCorner) {
        const moveVector = {
          x: captureVector.x - dx,
          y: captureVector.y - dy,
        };
        let moveLength = Math.sqrt(moveVector.x * moveVector.x + moveVector.y * moveVector.y);
        rotationVector = {
          x: moveVector.x / moveLength,
          y: moveVector.y / moveLength,
        };
        const angle = Math.atan2(rotationVector.y, rotationVector.x);
        a += ((angle - startAngle) / Math.PI) * 180;

        let dw = ((moveLength - startLength) / startLength) * w;
        let dh = ((moveLength - startLength) / startLength) * h;
        w += dw;
        h += dh;
        x -= dw / 2;
        y -= dh / 2;
      } else {
        x -= dx;
        y -= dy;
      }

      setPosition(value => ({
        x: x / props.width,
        y: y / props.height,
      }));
      setSize(value => ({
        x: w / props.width,
        y: h / props.height,
      }));
      setRotation(value => a);
      setRotationStr(value => `rotate(${a}deg)`);

      props.sticker.x = x / props.width;
      props.sticker.y = y / props.height;
      props.sticker.width = w / props.width;
      props.sticker.height = h / props.height;
      props.sticker.rotation = a;
    }
    function onMouseUp() {
      if (action) {
        action.update();
        props.store.pushAction(action);
      }
      document.body.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onMouseMove);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });

    window.addEventListener("touchmove", onMouseMove);
    window.addEventListener("touchend", onMouseUp, { once: true });
  };

  const removeSticker = () => {
    const action = new RemoveStickerAction(props.sticker);
    action.do(props.store);
    props.store.pushAction(action);
  };

  return (
    <Box
      id={"drag-resize"}
      key="drag-resize"
      position={"absolute"}
      style={{
        left: position.x * props.width,
        top: position.y * props.height,
        width: size.x * props.width,
        height: size.y * props.height,
        minWidth: MIN_SIZE,
        minHeight: MIN_SIZE,
        transform: rotationStr,
      }}
      //w={props.sticker.width * props.scale}
      //h={props.sticker.height * props.scale}
      bgColor={props.store.selectedToolIndex === PixelArtTool.stickers ? "#F008" : ""}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
      backgroundImage={props.sticker.imageBase64}
      backgroundSize={"contain"}
      backgroundPosition={"center"}
      backgroundRepeat={"no-repeat"}
    >
      {props.store.selectedToolIndex === PixelArtTool.stickers && (
        <Box position={"absolute"} width={"100%"} height={"100%"}>
          <Box
            backgroundImage={
              "linear-gradient(135deg, #FFF 12.5%, transparent 12.5%, transparent 25%, #FFF 25%, #FFF 37.5%, transparent 37.5%, transparent)"
            }
            backgroundSize={`${SAFE_ZONE}px ${SAFE_ZONE}px`}
            position={"absolute"}
            width={SAFE_ZONE + "px"}
            height={SAFE_ZONE + "px"}
            pointerEvents={"none"}
          />
          <Box
            backgroundImage={
              "linear-gradient(45deg, #FFF 12.5%, transparent 12.5%, transparent 25%, #FFF 25%, #FFF 37.5%, transparent 37.5%, transparent)"
            }
            backgroundSize={`${SAFE_ZONE}px ${SAFE_ZONE}px`}
            position={"absolute"}
            width={SAFE_ZONE + "px"}
            height={SAFE_ZONE + "px"}
            bottom={0}
            pointerEvents={"none"}
          />
          <Box
            backgroundImage={
              "linear-gradient(-45deg, #FFF 12.5%, transparent 12.5%, transparent 25%, #FFF 25%, #FFF 37.5%, transparent 37.5%, transparent)"
            }
            backgroundSize={`${SAFE_ZONE}px ${SAFE_ZONE}px`}
            position={"absolute"}
            width={SAFE_ZONE + "px"}
            height={SAFE_ZONE + "px"}
            right={0}
            bottom={0}
            pointerEvents={"none"}
          />
          <Box
            position={"absolute"}
            right={"0px"}
            onClick={removeSticker}
            fontSize={"30px"}
            color={"white"}
            width={SAFE_ZONE + "px"}
            height={SAFE_ZONE + "px"}
            lineHeight={SAFE_ZONE + "px"}
            textAlign={"center"}
          >
            &#215;
          </Box>
        </Box>
      )}
    </Box>
  );
});

export default StickerComponent;

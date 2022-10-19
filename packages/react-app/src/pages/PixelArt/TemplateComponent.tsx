import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import PixelArtPageStore from "./PixelArtPage.store";

const SAFE_ZONE = 20;
const MIN_SIZE = 50;

interface TemplateComponentProps {
  store: PixelArtPageStore;
  width: number;
  height: number;
  onChange?: (left: number, top: number, width: number, height: number) => void;
}

const TemplateComponent = observer(function DragResizeComponent(props: TemplateComponentProps) {
  const [position, setPosition] = useState({ x: props.store.templateLeft, y: props.store.templateTop });
  const [size, setSize] = useState({ x: props.store.templateWidth, y: props.store.templateHeight });

  const onMouseDown = (mouseDownEvent: any) => {
    const startSize = { x: size.x * props.width, y: size.y * props.height };
    const startPosition = { x: position.x * props.width, y: position.y * props.height };

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

    let rect = mouseDownEvent.target.getBoundingClientRect();
    clientX = clientX - rect.x;
    clientY = clientY - rect.y;
    let cornerX = 0;
    let cornerY = 0;

    if (clientX < SAFE_ZONE) cornerX = -1;
    if (clientX >= rect.width - SAFE_ZONE) cornerX = 1;
    if (clientY < SAFE_ZONE) cornerY = -1;
    if (clientY >= rect.height - SAFE_ZONE) cornerY = 1;

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

      let dx = capture.x - pageX;
      let dy = capture.y - pageY;
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

      w = Math.min(w, props.width * 1.5);
      h = Math.min(h, props.height * 1.5);

      setPosition(value => ({
        x: x / props.width,
        y: y / props.height,
      }));
      setSize(value => ({
        x: w / props.width,
        y: h / props.height,
      }));
      if (props.onChange) {
        props.onChange(x / props.width, y / props.height, w / props.width, h / props.height);
      }
    }
    function onMouseUp() {
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
      id="drag-resize"
      key="drag-resize"
      position={"relative"}
      style={{
        left: position.x * props.width,
        top: position.y * props.height,
        width: size.x * props.width,
        height: size.y * props.height,
        minWidth: MIN_SIZE,
        minHeight: MIN_SIZE,
      }}
      w={100}
      h={100}
      bgColor={"#F008"}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
      backgroundImage={props.store.templateImage}
      backgroundSize={"contain"}
      backgroundPosition={"center"}
      backgroundRepeat={"no-repeat"}
    >
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
        backgroundImage={
          "linear-gradient(-135deg, #FFF 12.5%, transparent 12.5%, transparent 25%, #FFF 25%, #FFF 37.5%, transparent 37.5%, transparent)"
        }
        backgroundSize={`${SAFE_ZONE}px ${SAFE_ZONE}px`}
        position={"absolute"}
        width={SAFE_ZONE + "px"}
        height={SAFE_ZONE + "px"}
        right={0}
        pointerEvents={"none"}
      />
    </Box>
  );
});

export default TemplateComponent;

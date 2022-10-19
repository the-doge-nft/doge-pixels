import { observer } from "mobx-react-lite";
import PixelArtPageStore, { Sticker } from "./PixelArtPage.store";
import { useEffect, useState } from "react";
import AppStore from "../../store/App.store";
import { PixelAction } from "./PixelArtActions";
import { PixelArtTool, pixelArtTools } from "./PixelArtTools";
import { TRANSPARENT_PIXEL } from "./PixelArtCanvas";
import { Box } from "@chakra-ui/react";
import StickerComponent from "./StickerComponent";

const CANVAS_ELEMENT_SIZE = 512;

const ArtCanvas = observer(({ store }: { store: PixelArtPageStore }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    let canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    store.setCanvas(canvas);
    setScale(getScale());
  });

  useEffect(() => {
    setScale(getScale());
    store.pixelsCanvas.updateCanvas();
  }, [AppStore.rwd.isMobile]);

  const getScale = () => {
    return AppStore.rwd.isMobile ? 0.6 : 1;
  };

  const updatePixel = (x: number, y: number, action: PixelAction) => {
    let canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const canvasCellSize = (CANVAS_ELEMENT_SIZE * scale) / store.pixelsCanvas.canvasSize;
    if (rect.left < x && rect.right > x && rect.top < y && rect.bottom > y) {
      const canvasX = Math.floor((x - rect.x) / canvasCellSize);
      const canvasY = Math.floor((y - rect.y) / canvasCellSize);
      action.update(store, canvasX, canvasY);
    }
  };

  const onMouseDown = (mouseDownEvent: any) => {
    if (!store.palette || !store.palette.length) return;

    let clientX = mouseDownEvent.clientX;
    let clientY = mouseDownEvent.clientY;

    if (mouseDownEvent.changedTouches) {
      let ourTouch = false;
      for (let touch of mouseDownEvent.changedTouches) {
        if (touch.identifier === 0) {
          clientX = touch.clientX;
          clientY = touch.clientY;
          ourTouch = true;
          break;
        }
      }
      if (!ourTouch) return;
    }

    const color =
      pixelArtTools[store.selectedToolIndex].id === PixelArtTool.pen
        ? store.palette[store.selectedBrushPixelIndex].hex
        : TRANSPARENT_PIXEL;
    let action = new PixelAction(color);
    let lastX = clientX;
    let lastY = clientY;
    updatePixel(clientX, clientY, action);

    function onMouseMove(mouseMoveEvent: any) {
      let clientX = mouseMoveEvent.clientX;
      let clientY = mouseMoveEvent.clientY;

      if (mouseMoveEvent.changedTouches) {
        let ourTouch = false;
        for (let touch of mouseMoveEvent.changedTouches) {
          if (touch.identifier === 0) {
            clientX = touch.clientX;
            clientY = touch.clientY;
            ourTouch = true;
            break;
          }
        }
        if (!ourTouch) return;
      }

      const cn = 10;
      let dx = (clientX - lastX) / cn;
      let dy = (clientY - lastY) / cn;
      for (let cd = 0; cd < cn; ++cd) {
        const x = lastX + dx * cd;
        const y = lastY + dy * cd;
        updatePixel(x, y, action);
      }
      lastX = clientX;
      lastY = clientY;
    }
    function onMouseUp() {
      if (action.isValid()) {
        store.pushAction(action);
      }

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
      border={"1px solid gray"}
      margin={"5px"}
      background={
        "linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), linear-gradient(45deg, rgba(0, 0, 0, 0.0980392) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.0980392) 75%, rgba(0, 0, 0, 0.0980392) 0), white"
      }
      backgroundRepeat={"repeat, repeat"}
      backgroundPosition={"0px 0, 8px 8px"}
      transformOrigin={"0 0 0"}
      backgroundClip={"border-box, border-box"}
      backgroundSize={"16px 16px, 16px 16px"}
    >
      <Box overflow={"hidden"} width={CANVAS_ELEMENT_SIZE * scale} height={CANVAS_ELEMENT_SIZE * scale}>
        <Box
          position={"relative"}
          top={store.templateTop * CANVAS_ELEMENT_SIZE * scale + "px"}
          left={store.templateLeft * CANVAS_ELEMENT_SIZE * scale + "px"}
          width={store.templateWidth * CANVAS_ELEMENT_SIZE * scale + "px"}
          height={store.templateHeight * CANVAS_ELEMENT_SIZE * scale + "px"}
          backgroundImage={store.isTemplateVisible ? store.templateImage : ""}
          backgroundSize={"contain"}
          backgroundPosition={"center"}
          backgroundRepeat={"no-repeat"}
          opacity={0.5}
        />
        <canvas
          style={{
            position: "relative",
            top: -store.templateHeight * scale * CANVAS_ELEMENT_SIZE,
            //touchAction: 'none'
          }}
          id="canvas"
          width={CANVAS_ELEMENT_SIZE * scale}
          height={CANVAS_ELEMENT_SIZE * scale}
          onMouseDown={onMouseDown}
          onTouchStart={onMouseDown}
        ></canvas>
        <Box
          position={"relative"}
          top={-store.templateHeight * scale * CANVAS_ELEMENT_SIZE - CANVAS_ELEMENT_SIZE * scale}
          width={CANVAS_ELEMENT_SIZE * scale}
          height={CANVAS_ELEMENT_SIZE * scale}
          pointerEvents={store.selectedToolIndex === PixelArtTool.stickers ? "all" : "none"}
        >
          {store.stickers.map((entry: Sticker, index: number) => {
            return (
              <StickerComponent
                key={index}
                store={store}
                width={CANVAS_ELEMENT_SIZE * scale}
                height={CANVAS_ELEMENT_SIZE * scale}
                sticker={entry}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
});

export default ArtCanvas;

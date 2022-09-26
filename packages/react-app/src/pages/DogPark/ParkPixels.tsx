import {useCallback, useEffect, useState} from "react";
import Kobosu from "../../images/THE_ACTUAL_NFT_IMAGE.png";
import { Box, useColorMode } from "@chakra-ui/react";
import AppStore from "../../store/App.store";
import { observer } from "mobx-react-lite";
import { lightOrDarkMode } from "../../DSL/Theme";

interface ParkPixelsProps {
  selectedPixel: number;
  previewPixels: number[];
  onPupperClick: (pupper: number | null) => void;
  id: string
}

interface IPupperRectPosition {
  pupper: number;
  x: number;
  y: number;
}

export const IMAGE_WIDTH = 400;
export const IMAGE_HEIGHT = 300;
const PIXEL_OFFSET_X = 50;
const TOP_PIXEL_OFFSET_Y = 20;
const BOTTOM_PIXEL_OFFSET_Y = 200;
const PIXEL_PANE_WIDTH = 70;
const PIXEL_PANE_HEIGHT = 70;
const PIXEL_TEXT_HEIGHT = 20;
const PIXEL_WIDTH = 15;
const PIXEL_HEIGHT = 15;
const SCALE = IMAGE_WIDTH / 640;

// @next use refs here instead of getElementById()

const getPixelOffsets = (y: number) => {
  if (y * SCALE <= IMAGE_HEIGHT / 2) {
    return [PIXEL_OFFSET_X, BOTTOM_PIXEL_OFFSET_Y];
  } else {
    return [PIXEL_OFFSET_X, TOP_PIXEL_OFFSET_Y];
  }
};

const ParkPixels = observer(({ selectedPixel, previewPixels = [], onPupperClick, id }: ParkPixelsProps) => {
  const { colorMode } = useColorMode();
  const [pupperPositions, setPupperPositions] = useState<IPupperRectPosition[]>([]);

  useEffect(() => {
    const length = previewPixels?.length;
    let positions: IPupperRectPosition[] = [];
    for (let i = 0; i < length; i++) {
      const [x, y] = AppStore.web3.pupperToPixelCoordsLocal(previewPixels[i]);
      positions.push({
        pupper: previewPixels[i],
        x: x * SCALE - PIXEL_WIDTH / 2,
        y: y * SCALE - PIXEL_HEIGHT / 2,
      });
    }

    setPupperPositions(positions);
  }, [previewPixels]);

  useEffect(() => {
    // @next there are some rendering issues where pupperPositions is 0
    if (pupperPositions.length !== 0) {
      drawBackground()
    }
  }, [pupperPositions, selectedPixel])

  const drawSelectedPixel = (ctx: CanvasRenderingContext2D) => {
    if (selectedPixel === -1) return;

    const [selectedX, selectedY] = AppStore.web3.pupperToPixelCoordsLocal(selectedPixel);
    let fillColor = lightOrDarkMode(colorMode, "#ffd335", "#ff00e5");
    ctx.save();
    ctx.fillStyle = fillColor;
    ctx.fillRect(selectedX * SCALE - PIXEL_WIDTH / 2, selectedY * SCALE - PIXEL_HEIGHT / 2, PIXEL_WIDTH, PIXEL_HEIGHT);
    ctx.restore();
  };

  const drawPixels = (ctx: CanvasRenderingContext2D) => {
    const length = pupperPositions.length;
    if (length < 1) return;
    ctx.save();

    let strokeColor = lightOrDarkMode(colorMode, "red", "#4b0edd");
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;

    for (let i = 0; i < length; i++) {
      if (pupperPositions[i].pupper !== selectedPixel) {
        ctx.rect(pupperPositions[i].x, pupperPositions[i].y, PIXEL_WIDTH, PIXEL_HEIGHT);
      }
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };

  const drawPixelPane = (ctx: CanvasRenderingContext2D) => {
    if (selectedPixel === -1) return;
    const [x, y] = AppStore.web3.pupperToPixelCoordsLocal(selectedPixel);
    let paneY: number;

    if (y * SCALE <= IMAGE_HEIGHT / 2) {
      paneY = BOTTOM_PIXEL_OFFSET_Y;
    } else {
      paneY = TOP_PIXEL_OFFSET_Y;
    }
    ctx.save();
    ctx.beginPath();
    const hex = AppStore.web3.pupperToHexLocal(selectedPixel);
    ctx.fillStyle = hex;
    ctx.fillRect(PIXEL_OFFSET_X, paneY, PIXEL_PANE_WIDTH, PIXEL_PANE_HEIGHT);

    let fillColor = lightOrDarkMode(colorMode, "#FFF8E4", "#180e30");
    ctx.fillStyle = fillColor;
    ctx.fillRect(PIXEL_OFFSET_X, paneY + PIXEL_PANE_HEIGHT, PIXEL_PANE_WIDTH, PIXEL_TEXT_HEIGHT);

    ctx.font = "7px PressStart2P";
    let textColor = lightOrDarkMode(colorMode, "black", "white");
    ctx.strokeStyle = textColor;
    ctx.rect(PIXEL_OFFSET_X, paneY, PIXEL_PANE_WIDTH, PIXEL_PANE_HEIGHT + PIXEL_TEXT_HEIGHT);
    ctx.lineTo(PIXEL_OFFSET_X, paneY + PIXEL_PANE_HEIGHT);
    ctx.lineTo(PIXEL_OFFSET_X + PIXEL_PANE_WIDTH, paneY + PIXEL_PANE_HEIGHT);
    ctx.stroke();
    ctx.fillStyle = textColor;
    ctx.fillText(`(${x},${y})`, PIXEL_OFFSET_X + 3, paneY + PIXEL_PANE_HEIGHT + 14);
    ctx.closePath();
    ctx.restore();
  };

  const drawPixelPointer = (ctx: CanvasRenderingContext2D) => {
    if (selectedPixel === -1) return;
    const [x, y] = AppStore.web3.pupperToPixelCoordsLocal(selectedPixel);
    const [pixelOffsetX, pixelOffsetY] = getPixelOffsets(y);
    let y1;

    if (pixelOffsetY === BOTTOM_PIXEL_OFFSET_Y) {
      y1 = BOTTOM_PIXEL_OFFSET_Y;
    } else {
      y1 = TOP_PIXEL_OFFSET_Y + PIXEL_PANE_HEIGHT + PIXEL_TEXT_HEIGHT;
    }

    const x1 = pixelOffsetX + 20;
    const x2 = pixelOffsetX + 45;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x * SCALE, y * SCALE);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x * SCALE, y * SCALE);
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.stroke();
    ctx.fill();

    ctx.closePath();
    ctx.restore();
  };

  const drawScaledImage = (img: any, ctx: CanvasRenderingContext2D) => {
    const pixelRatio = window.devicePixelRatio
    var canvas = ctx.canvas;
    var hRatio = canvas.width / img.width;
    var vRatio = canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);

    var centerShift_x = (canvas.width - img.width * ratio) / 2;
    var centerShift_y = (canvas.height - img.height * ratio) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.drawImage(
      img,
      0,
      0,
      img.width * pixelRatio,
      img.height * pixelRatio,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio,
    );
    ctx.rect(0, 0, img.width * ratio, img.height * ratio);
    ctx.closePath();
    ctx.restore();
  };

  const drawBackground = async () => {
    let canvas: HTMLCanvasElement = document.getElementById(id) as HTMLCanvasElement;
    if (canvas.getContext) {
      let ctx = canvas.getContext("2d");
      if (!ctx) return;

      let img = await loadImage(Kobosu);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawScaledImage(img, ctx);

      drawSelectedPixel(ctx);

      drawPixels(ctx);
      drawPixelPane(ctx);
      drawPixelPointer(ctx);
    }
  };

  const loadImage = (url: string): Promise<CanvasImageSource> => {
    return new Promise(r => {
      let i = new Image();
      i.onload = () => r(i);
      i.src = url;
    });
  };

  const onCanvasMouseMove = (e: any) => {
    const x = e.clientX;
    const y = e.clientY;

    let canvas: HTMLCanvasElement = document.getElementById(id) as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();

    const offsetX = x - rect.x;
    const offsetY = y - rect.y;

    const pupper = getPupperFromPosition(offsetX, offsetY);
    if (pupper) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }
  };

  function isInside(x: number, y: number, z1: number, z2: number, z3: number, z4: number) {
    const x1 = Math.min(z1, z3);
    const x2 = Math.max(z1, z3);
    const y1 = Math.min(z2, z4);
    const y2 = Math.max(z2, z4);
    if (x1 <= x && x <= x2 && y1 <= y && y <= y2) {
      return true;
    } else {
      return false;
    }
  }

  const getPupperFromPosition = (x: number, y: number) => {
    const length = pupperPositions.length;
    for (let i = 0; i < length; i++) {
      if (
        isInside(
          x,
          y,
          pupperPositions[i].x,
          pupperPositions[i].y,
          pupperPositions[i].x + PIXEL_WIDTH,
          pupperPositions[i].y + PIXEL_HEIGHT,
        )
      ) {
        return pupperPositions[i].pupper;
      }
    }

    return;
  };

  const onCanvasMouseDown = (e: any) => {
    const x = e.clientX;
    const y = e.clientY;
    let canvas: HTMLCanvasElement = document.getElementById(id) as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();

    const offsetX = x - rect.x;
    const offsetY = y - rect.y;

    const pupper = getPupperFromPosition(offsetX, offsetY);
    if (pupper) {
      onPupperClick(pupper);
    } else {
      onPupperClick(null);
    }
  };

  const drawOnMount = useCallback((node: any) => {
    // scale the canvas so we don't see pixelated shapes
    let ratio = window.devicePixelRatio;
    let cv = document.getElementById(id) as HTMLCanvasElement;
    if (cv) {
      cv.width = IMAGE_WIDTH * ratio;
      cv.height = IMAGE_HEIGHT * ratio;
      cv.style.width = IMAGE_WIDTH + "px";
      cv.style.height = IMAGE_HEIGHT + "px";
      cv.getContext("2d")!.scale(ratio, ratio);
    }
  }, [])

  return (
    <Box
      w={IMAGE_WIDTH}
      h={IMAGE_HEIGHT}
      overflow={"hidden"}
      borderWidth={1}
      borderColor={lightOrDarkMode(colorMode, "black", "white")}
      _focus={{ boxShadow: "none" }}
    >
      <canvas
        ref={drawOnMount}
        id={id}
        onMouseMove={e => onCanvasMouseMove(e)}
        onMouseDown={e => onCanvasMouseDown(e)}
      />
    </Box>
  );
});

export default ParkPixels;

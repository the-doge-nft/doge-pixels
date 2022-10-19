import { useCallback, useEffect, useMemo, useState } from "react";
import Kobosu from "../../images/THE_ACTUAL_NFT_IMAGE.png";
import { Box, useColorMode } from "@chakra-ui/react";
import AppStore from "../../store/App.store";
import { observer } from "mobx-react-lite";
import { lightOrDarkMode } from "../Theme";
import jsonify from "../../helpers/jsonify";

interface ParkPixelsProps {
  selectedTokenId: number | null;
  previewPixels: number[];
  onPupperClick?: (pupper: number | null) => void;
  id: string;
  size?: PixelPreviewSize;
}

interface IPupperRectPosition {
  pupper: number;
  x: number;
  y: number;
}

export enum PixelPreviewSize {
  sm = "sm",
  md = "md",
  lg = "lg",
}

const imageProperties = {
  [PixelPreviewSize.sm]: {
    height: 275 * 0.75,
    width: 275,
    scale: 275 / 650,
    pixelSize: 10,
    pixelPaneSize: 50,
    pixelPaneTextBoxSize: 20,
    pixelPaneTextSize: 5,
  },
  [PixelPreviewSize.md]: {
    height: 350 * 0.75,
    width: 350,
    scale: 350 / 640,
    pixelSize: 12,
    pixelPaneSize: 60,
    pixelPaneTextBoxSize: 20,
    pixelPaneTextSize: 6,
  },
  [PixelPreviewSize.lg]: {
    height: 450 * 0.75,
    width: 450,
    scale: 450 / 640,
    pixelSize: 15,
    pixelPaneSize: 70,
    pixelPaneTextBoxSize: 20,
    pixelPaneTextSize: 7,
  },
};

const PixelPreview = observer(
  ({ size = PixelPreviewSize.md, selectedTokenId, previewPixels = [], onPupperClick, id }: ParkPixelsProps) => {
    const { colorMode } = useColorMode();
    const [pupperPositions, setPupperPositions] = useState<IPupperRectPosition[]>([]);
    const properties = useMemo(() => imageProperties[size], [size]);

    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => setHasMounted(true), []);

    const PIXEL_OFFSET_X = properties.width / 9;
    const TOP_PIXEL_OFFSET_Y = properties.height / 16.875;
    const BOTTOM_PIXEL_OFFSET_Y = properties.height / 1.6875;

    const getPixelOffsets = useCallback(
      (y: number) => {
        if (y * properties.scale <= properties.height / 2) {
          return [PIXEL_OFFSET_X, BOTTOM_PIXEL_OFFSET_Y];
        } else {
          return [PIXEL_OFFSET_X, TOP_PIXEL_OFFSET_Y];
        }
      },
      [properties],
    );

    useEffect(() => {
      const length = previewPixels?.length;
      let positions: IPupperRectPosition[] = [];
      for (let i = 0; i < length; i++) {
        const [x, y] = AppStore.web3.pupperToPixelCoordsLocal(previewPixels[i]);
        positions.push({
          pupper: previewPixels[i],
          x: x * properties.scale - properties.pixelSize / 2,
          y: y * properties.scale - properties.pixelSize / 2,
        });
      }

      setPupperPositions(positions);
    }, [jsonify(previewPixels), properties]);

    useEffect(() => {
      // @next there are some rendering issues where pupperPositions is 0
      if (pupperPositions.length !== 0 || hasMounted) {
        updateResolution();
        drawBackground();
      }
    }, [jsonify(pupperPositions), selectedTokenId, size]);

    const drawSelectedPixel = (ctx: CanvasRenderingContext2D) => {
      if (!selectedTokenId) return;

      const [selectedX, selectedY] = AppStore.web3.pupperToPixelCoordsLocal(selectedTokenId);
      let fillColor = lightOrDarkMode(colorMode, "#ffd335", "#ff00e5");
      ctx.save();
      ctx.fillStyle = fillColor;
      ctx.fillRect(
        selectedX * properties.scale - properties.pixelSize / 2,
        selectedY * properties.scale - properties.pixelSize / 2,
        properties.pixelSize,
        properties.pixelSize,
      );
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
        if (pupperPositions[i].pupper !== selectedTokenId) {
          ctx.rect(pupperPositions[i].x, pupperPositions[i].y, properties.pixelSize, properties.pixelSize);
        }
      }
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    };

    const drawPixelPane = (ctx: CanvasRenderingContext2D) => {
      if (!selectedTokenId) return;
      const [x, y] = AppStore.web3.pupperToPixelCoordsLocal(selectedTokenId);
      let paneY: number;

      if (y * properties.scale <= properties.height / 2) {
        paneY = BOTTOM_PIXEL_OFFSET_Y;
      } else {
        paneY = TOP_PIXEL_OFFSET_Y;
      }
      ctx.save();
      ctx.beginPath();
      const hex = AppStore.web3.pupperToHexLocal(selectedTokenId);
      ctx.fillStyle = hex;
      ctx.fillRect(PIXEL_OFFSET_X, paneY, properties.pixelPaneSize, properties.pixelPaneSize);

      let fillColor = lightOrDarkMode(colorMode, "#FFF8E4", "#180e30");
      ctx.fillStyle = fillColor;
      ctx.fillRect(
        PIXEL_OFFSET_X,
        paneY + properties.pixelPaneSize,
        properties.pixelPaneSize,
        properties.pixelPaneTextBoxSize,
      );

      ctx.font = `${properties.pixelPaneTextSize}px PressStart2P`;
      let textColor = lightOrDarkMode(colorMode, "black", "white");
      ctx.strokeStyle = textColor;
      ctx.rect(
        PIXEL_OFFSET_X,
        paneY,
        properties.pixelPaneSize,
        properties.pixelPaneSize + properties.pixelPaneTextBoxSize,
      );
      ctx.lineTo(PIXEL_OFFSET_X, paneY + properties.pixelPaneSize);
      ctx.lineTo(PIXEL_OFFSET_X + properties.pixelPaneSize, paneY + properties.pixelPaneSize);
      ctx.stroke();
      ctx.fillStyle = textColor;
      ctx.fillText(`(${x},${y})`, PIXEL_OFFSET_X + 3, paneY + properties.pixelPaneSize + 14);
      ctx.closePath();
      ctx.restore();
    };

    const drawPixelPointer = (ctx: CanvasRenderingContext2D) => {
      if (!selectedTokenId) return;
      const [x, y] = AppStore.web3.pupperToPixelCoordsLocal(selectedTokenId);
      const [pixelOffsetX, pixelOffsetY] = getPixelOffsets(y);
      let y1;

      if (pixelOffsetY === BOTTOM_PIXEL_OFFSET_Y) {
        y1 = BOTTOM_PIXEL_OFFSET_Y;
      } else {
        y1 = TOP_PIXEL_OFFSET_Y + properties.pixelPaneSize + properties.pixelPaneTextBoxSize;
      }

      const x1 = pixelOffsetX + 20;
      const x2 = pixelOffsetX + 45;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x * properties.scale, y * properties.scale);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y1);
      ctx.lineTo(x * properties.scale, y * properties.scale);
      ctx.strokeStyle = "#000000";
      ctx.fillStyle = "#000000";
      ctx.stroke();
      ctx.fill();

      ctx.closePath();
      ctx.restore();
    };

    const drawScaledImage = (img: any, ctx: CanvasRenderingContext2D) => {
      const pixelRatio = window.devicePixelRatio;
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
      if (pupper && onPupperClick) {
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
            pupperPositions[i].x + properties.pixelSize,
            pupperPositions[i].y + properties.pixelSize,
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

      if (onPupperClick) {
        if (pupper) {
          onPupperClick(pupper);
        } else {
          onPupperClick(null);
        }
      }
    };

    const updateResolution = () => {
      // scale the canvas so we don't see pixelated shapes
      let ratio = window.devicePixelRatio;
      let cv = document.getElementById(id) as HTMLCanvasElement;
      if (cv) {
        cv.width = properties.width * ratio;
        cv.height = properties.height * ratio;
        cv.style.width = properties.width + "px";
        cv.style.height = properties.height + "px";
        cv.getContext("2d")!.scale(ratio, ratio);
        drawBackground();
      }
    };

    return (
      <Box
        w={properties.width}
        h={properties.height}
        overflow={"hidden"}
        borderWidth={1}
        borderColor={lightOrDarkMode(colorMode, "black", "white")}
        _focus={{ boxShadow: "none" }}
      >
        <canvas id={id} onMouseMove={e => onCanvasMouseMove(e)} onMouseDown={e => onCanvasMouseDown(e)} />
      </Box>
    );
  },
);

export default PixelPreview;

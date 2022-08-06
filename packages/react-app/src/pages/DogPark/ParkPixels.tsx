import { useEffect } from "react";
import Kobosu from "../../images/THE_ACTUAL_NFT_IMAGE.png"
import { Box, useColorMode } from "@chakra-ui/react";
import AppStore from "../../store/App.store";
import {observer} from "mobx-react-lite";
import { lightOrDark } from "../../DSL/Theme";

interface ParkPixelsProps {
  selectedPupper: number;
  puppers: {address: string, puppers: number[], ens?: string}
}

export enum CameraPositionZ {
  far = 4800,
  medium = 300,
  close = 80
}

export const IMAGE_WIDTH = 400
export const IMAGE_HEIGHT = 300
const PIXEL_OFFSET_X = 50;
const TOP_PIXEL_OFFSET_Y = 20;
const BOTTOM_PIXEL_OFFSET_Y = 200;
const PIXEL_PANE_WIDTH = 70;
const PIXEL_PANE_HEIGHT = 70;
const PIXEL_TEXT_HEIGHT = 20;
const PIXEL_WIDTH = 20;
const PIXEL_HEIGHT = 20;
const SCALE = IMAGE_WIDTH / 640;

const getPixelOffsets = (y: number) => {
  if (y * SCALE <= IMAGE_HEIGHT / 2) {
    return [PIXEL_OFFSET_X, BOTTOM_PIXEL_OFFSET_Y];
  } else {
    return [PIXEL_OFFSET_X, TOP_PIXEL_OFFSET_Y];
  }
}

const ParkPixels = observer(({selectedPupper, puppers}: ParkPixelsProps) => {
  const colorMode = useColorMode();
   useEffect(() => {
    drawBackground()
   }, [selectedPupper, puppers])
   
   const drawSelectedPixel = (ctx: CanvasRenderingContext2D) => {
    if (selectedPupper === -1) return;
    const [selectedX, selectedY] = AppStore.web3.pupperToPixelCoordsLocal(selectedPupper);
    let fillColor = lightOrDark(colorMode.colorMode, "#ffd335", "#ff00e5");
    ctx.save();
    ctx.fillStyle = fillColor;
    ctx.fillRect(selectedX * SCALE - PIXEL_WIDTH /2, selectedY * SCALE - PIXEL_HEIGHT /2, PIXEL_WIDTH, PIXEL_HEIGHT);
    ctx.restore();
   }

   const drawPixels = (ctx: CanvasRenderingContext2D) => {
    const length = puppers.puppers.length;
    if (length < 1) return;
    ctx.save();
 
    let strokeColor = lightOrDark(colorMode.colorMode, "black", "#4b0edd")
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;

    for(let i = 0 ; i < length; i ++) {
      if (puppers.puppers[i] !== selectedPupper) {
        const [x, y] = AppStore.web3.pupperToPixelCoordsLocal(puppers.puppers[i]);
        ctx.rect(x * SCALE  - PIXEL_WIDTH /2, y* SCALE - PIXEL_HEIGHT /2, PIXEL_WIDTH, PIXEL_HEIGHT);
      } 
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
   }

   const drawPixelPane = (ctx: CanvasRenderingContext2D) => {
    if(selectedPupper === -1) return;
    const [, y] = AppStore.web3.pupperToPixelCoordsLocal(selectedPupper);
    let paneY: number;

    if (y * SCALE <= IMAGE_HEIGHT / 2) {
      paneY = BOTTOM_PIXEL_OFFSET_Y;
    } else {
      paneY = TOP_PIXEL_OFFSET_Y;
    }
    ctx.save();
    ctx.beginPath();
    const hex = AppStore.web3.pupperToHexLocal(selectedPupper);
    ctx.fillStyle = hex;
    ctx.fillRect(PIXEL_OFFSET_X, paneY, PIXEL_PANE_WIDTH, PIXEL_PANE_HEIGHT);
    
    let fillColor = lightOrDark(colorMode.colorMode, "white", "#180e30")
    ctx.fillStyle = fillColor;
    ctx.fillRect(PIXEL_OFFSET_X, paneY + PIXEL_PANE_HEIGHT, PIXEL_PANE_WIDTH, PIXEL_TEXT_HEIGHT);
   
    ctx.font = "8px PressStart2P";
    let textColor = lightOrDark(colorMode.colorMode, "black", "white")
    ctx.strokeStyle = textColor
    ctx.rect(PIXEL_OFFSET_X, paneY, PIXEL_PANE_WIDTH, PIXEL_PANE_HEIGHT + PIXEL_TEXT_HEIGHT);
    ctx.lineTo(PIXEL_OFFSET_X, paneY + PIXEL_PANE_HEIGHT)
    ctx.lineTo(PIXEL_OFFSET_X + PIXEL_PANE_WIDTH, paneY + PIXEL_PANE_HEIGHT)
    ctx.stroke();
    ctx.fillStyle = textColor;
    const pupperIndex = AppStore.web3.pupperToIndexLocal(selectedPupper)
    ctx.fillText(`# ${pupperIndex}`, PIXEL_OFFSET_X + 5, paneY + PIXEL_PANE_HEIGHT + 15);
    ctx.closePath();
    ctx.restore();
   }

   const drawPixelPointer = (ctx: CanvasRenderingContext2D) => {
    if (selectedPupper === -1) return;
    const [x, y] = AppStore.web3.pupperToPixelCoordsLocal(selectedPupper);
    const [pixelOffsetX, pixelOffsetY] = getPixelOffsets(y);
    let y1;

    if (pixelOffsetY === BOTTOM_PIXEL_OFFSET_Y) {
      y1 = BOTTOM_PIXEL_OFFSET_Y;
    } else {
      y1 = TOP_PIXEL_OFFSET_Y + PIXEL_PANE_HEIGHT + PIXEL_TEXT_HEIGHT;
    }

    const x1 = pixelOffsetX + 20
    const x2 = pixelOffsetX + 45
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x * SCALE, y * SCALE);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x * SCALE, y * SCALE);
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.stroke();
    ctx.fill();
  
    ctx.closePath();
    ctx.restore();
  }
 
  const drawScaledImage = (img: any, ctx: CanvasRenderingContext2D) => {
      var canvas = ctx.canvas ;
      var hRatio = canvas.width  / img.width    ;
      var vRatio =  canvas.height / img.height  ;
      var ratio  = Math.min ( hRatio, vRatio );
      var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
      var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
      ctx.clearRect(0,0,canvas.width, canvas.height);
      ctx.drawImage(img, 0,0, img.width, img.height,
        centerShift_x, centerShift_y, img.width*ratio, img.height*ratio);  
      ctx.rect(0, 0, img.width*ratio, img.height*ratio);
      let borderColor = lightOrDark(colorMode.colorMode, "black", "white")
      ctx.strokeStyle = borderColor;
      ctx.stroke();
  }

  const drawBackground = async () => {
    let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas.getContext) {

      let ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let img = await loadImage(Kobosu);

      drawScaledImage(img, ctx);
      drawPixelPane(ctx);
      drawSelectedPixel(ctx);
      drawPixelPointer(ctx)
      drawPixels(ctx);
    }
   }

  const loadImage = (url: string): Promise<CanvasImageSource> => {
    return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = url; });
  }
 
  return (
    <Box
         w={400}
         h={300}
         zIndex={2}
         _focus={{boxShadow: "none", borderColor: "inherit"}}
    >
       <canvas id='canvas' width={400} height={300}>

       </canvas>
    </Box>
  );
});


export default ParkPixels;

import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {Object3D} from "three";
import {Canvas, useLoader} from "@react-three/fiber";
import Kobosu from "../../images/THE_ACTUAL_NFT_IMAGE.png"
import {Box, useColorMode} from "@chakra-ui/react";
import {createCanvasPixelSelectionSetter, getWorldPixelCoordinate, resizeCanvas} from "../Viewer/helpers";
import {onPixelSelectType} from "../Viewer/Viewer.page";
import ViewerStore from "../Viewer/Viewer.store";
import {SELECT_PIXEL} from "../../services/mixins/eventable";
import Button, {ButtonVariant} from "../../DSL/Button/Button";
import createPanZoom, {PanZoomReturn} from "../../services/three-map-js";
import PixelPane from "../../DSL/PixelPane/PixelPane";
import AppStore from "../../store/App.store";
import {observer} from "mobx-react-lite";
import Colors from "../../DSL/Colors/Colors";

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
const PIXEL_WIDTH = 70;
const PIXEL_HEIGHT = 70;
const PIXEL_TEXT_HEIGHT = 20;

const ParkPixels = observer(({selectedPupper, puppers}: ParkPixelsProps) => {
   useEffect(() => {
    drawBackground()
   }, [selectedPupper])

   const drawPixels = (ctx: CanvasRenderingContext2D) => {

   }

   const drawPixelPane = (ctx: CanvasRenderingContext2D) => {
    const [, y] = AppStore.web3.pupperToPixelCoordsLocal(selectedPupper);
    let paneY: number;
    if (y <= IMAGE_HEIGHT / 2) {
      paneY = BOTTOM_PIXEL_OFFSET_Y;
    } else {
      paneY = TOP_PIXEL_OFFSET_Y;
    }
    ctx.fillStyle = AppStore.web3.pupperToHexLocal(selectedPupper);
    ctx.fillRect(PIXEL_OFFSET_X, paneY, PIXEL_WIDTH, PIXEL_HEIGHT);
    
    ctx.fillStyle = "white";
    ctx.fillRect(PIXEL_OFFSET_X, paneY + PIXEL_HEIGHT, PIXEL_WIDTH, PIXEL_TEXT_HEIGHT);
   }

   function getPixelOffsets(y: number) {
    if (y <= IMAGE_HEIGHT / 2) {
      return [PIXEL_OFFSET_X, BOTTOM_PIXEL_OFFSET_Y];
    } else {
      return [PIXEL_OFFSET_X, TOP_PIXEL_OFFSET_Y];
    }
  }

   function drawPixelPointer(ctx: CanvasRenderingContext2D) {
    const scale = IMAGE_WIDTH / 640;
    const [x, y] = AppStore.web3.pupperToPixelCoordsLocal(selectedPupper);
    const [pixelOffsetX, pixelOffsetY] = getPixelOffsets(y);
    let y1;

    if (pixelOffsetY === BOTTOM_PIXEL_OFFSET_Y) {
      y1 = BOTTOM_PIXEL_OFFSET_Y;
    } else {
      y1 = TOP_PIXEL_OFFSET_Y + PIXEL_HEIGHT + PIXEL_TEXT_HEIGHT;
    }
    console.log({pixelOffsetY})
    const x1 = pixelOffsetX + 20
    const x2 = pixelOffsetX + 45
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x * scale, y * scale);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x * scale, y * scale);
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.stroke();
    ctx.fill();
  
    ctx.closePath();
  
    // return ctx;
  }
 
  function drawImageScaled(img: any, ctx: CanvasRenderingContext2D) {
      var canvas = ctx.canvas ;
      var hRatio = canvas.width  / img.width    ;
      var vRatio =  canvas.height / img.height  ;
      var ratio  = Math.min ( hRatio, vRatio );
      var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
      var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
      ctx.clearRect(0,0,canvas.width, canvas.height);
      ctx.drawImage(img, 0,0, img.width, img.height,
                        centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);  
  }
   const drawBackground = async () => {
    let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas.getContext) {

      let ctx = canvas.getContext('2d');
      if (!ctx) return;
      let img = await loadImage(Kobosu);

      // ctx.drawImage(img, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
      drawImageScaled(img, ctx);
      drawPixelPane(ctx);
      drawPixelPointer(ctx)
    }
   }

   function loadImage(url: string): Promise<CanvasImageSource> {
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

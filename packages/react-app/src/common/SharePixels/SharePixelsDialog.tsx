import { Flex, useColorMode } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { lightOrDark } from "../../DSL/Theme";
import AppStore from "../../store/App.store";
import SharePixelsDialogStore from "./SharePixelsDialog.store";
import Kobosu from "../../images/THE_ACTUAL_NFT_IMAGE.png"
import MintImg from "../../images/mint.png"
import BurnImg from "../../images/burn.png"
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { RiFacebookCircleLine, RiTwitterLine, RiRedditLine } from 'react-icons/ri';
import { Icon } from '@chakra-ui/react'
import BurnPixelsDialogStore from "../BurnPixels/BurnPixelsDialog.store";
import BurnPixelsModalStore from "../../pages/Viewer/BurnPixelsModal/BurnPixelsModal.store";

interface SharePixelsDialogProps {
  store: SharePixelsDialogStore;
  isMinted: boolean;
}
interface IPupperRectPosition {
  pupper: number;
  x: number,
  y: number,
}
export const IMAGE_WIDTH = 400
export const IMAGE_HEIGHT = 300
const PIXEL_WIDTH = 15;
const PIXEL_HEIGHT = 15;
const SCALE = IMAGE_WIDTH / 640;

const SharePixelsDialog = observer(({store, isMinted}: SharePixelsDialogProps) => {

  const [pupperPositions, setPupperPositions] = useState<IPupperRectPosition[]>([])
  const colorMode = useColorMode();

  useEffect(() => {
    const length = AppStore.web3.updatedPuppers.length;
    let positions: IPupperRectPosition[] = [];
    for(let i = 0 ; i < length; i ++) {
      const [x, y] = AppStore.web3.pupperToPixelCoordsLocal(AppStore.web3.updatedPuppers[i]);
      positions.push({
        pupper: AppStore.web3.updatedPuppers[i],
        x: x * SCALE  - PIXEL_WIDTH /2,
        y: y* SCALE - PIXEL_HEIGHT /2
      })
    }

    setPupperPositions(positions);
   }, [AppStore.web3.updatedPuppers, colorMode])

  useEffect(() => {
    console.log({pupperPositions})
    drawBackground()
  }, [pupperPositions])
  const drawPixels = (ctx: CanvasRenderingContext2D) => {
    const length = pupperPositions.length;

    if (length < 1) return;
    ctx.save();
 
    let strokeColor = lightOrDark(colorMode.colorMode, "red", "#4b0edd")
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;

    for(let i = 0 ; i < length; i ++) {
        ctx.rect(pupperPositions[i].x, pupperPositions[i].y, PIXEL_WIDTH, PIXEL_HEIGHT);
    }
    ctx.stroke();
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
      ctx.save();
      ctx.beginPath();
      ctx.drawImage(img, 0,0, img.width, img.height,
        centerShift_x, centerShift_y, img.width*ratio, img.height*ratio);  
      ctx.rect(0, 0, img.width*ratio, img.height*ratio);
      let borderColor = lightOrDark(colorMode.colorMode, "black", "white")
      ctx.strokeStyle = borderColor;
      ctx.stroke();
      ctx.closePath()
      ctx.restore();
  }

  const drawBackground = async () => {
    let canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas.getContext) {

      let ctx = canvas.getContext('2d');
      if (!ctx) return;

      let img = await loadImage(Kobosu);
      let markImg;
      if (isMinted)
       markImg= await loadImage(MintImg);
      else {
        markImg = await loadImage(BurnImg);
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawScaledImage(img, ctx); 
      ctx.drawImage(markImg, 290,270, 100, 20);
      drawPixels(ctx);
    }
  }

  const loadImage = (url: string): Promise<CanvasImageSource> => {
    return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = url; });
  }
  return <>
     <Typography variant={TVariant.ComicSans18} block style={{marginBottom: "15px"}}>
      {
        `You just ${isMinted ? 'minted': 'burned'} 3 pixels - let your friends know`
      }
      </Typography>
      <Flex justifyContent={"center"} marginBottom={"20px"}>
       <canvas id='canvas' width={400} height={300}/>
      </Flex>
      <Flex justifyContent={"space-around"} width={"250px"} margin={"auto"}>
        <Icon as={RiTwitterLine} color="black" boxSize={12} cursor={"pointer"}/>
        <Icon as={RiRedditLine} color="black" boxSize={12} cursor={"pointer"}/>
        <Icon as={RiFacebookCircleLine} color="black" boxSize={12}  cursor={"pointer"} />
      </Flex>
  </>
})

export default SharePixelsDialog

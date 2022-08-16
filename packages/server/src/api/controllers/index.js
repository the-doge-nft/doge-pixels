// const Jimp = require('jimp')
// const fs = require('fs')
// const {createCanvas} = require('canvas')

// const PIXEL_WIDTH = 90;
// const PIXEL_HEIGHT = 90;
// const WIDTH = 640;
// const HEIGHT = 480;
// const PIXEL_TO_ID_OFFSET = 1000000;

// function pupperToIndexLocal(pupper) {
//   return pupper - PIXEL_TO_ID_OFFSET
// }
// function pupperToPixelCoordsLocal(pupper) {
//   const index = pupperToIndexLocal(pupper)
//   return [index % WIDTH, Math.floor(index / WIDTH)]
// }
// const drawPixels = (ctx, pupperPositions) => {
//     const length = pupperPositions.length;

//     if (length < 1) return;
//     ctx.save();
 
//     let strokeColor = lightOrDark(colorMode.colorMode, "red", "#4b0edd")
//     ctx.beginPath();
//     ctx.strokeStyle = strokeColor;

//     for(let i = 0 ; i < length; i ++) {
//         ctx.rect(pupperPositions[i].x, pupperPositions[i].y, PIXEL_WIDTH, PIXEL_HEIGHT);
//     }
//     ctx.stroke();
//     ctx.closePath();
//     ctx.restore();
// }
// const drawScaledImage = (img, ctx) => {
//     var canvas = ctx.canvas ;
//     var hRatio = canvas.width  / img.width    ;
//     var vRatio =  canvas.height / img.height  ;
//     var ratio  = Math.min ( hRatio, vRatio );
//     var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
//     var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
//     ctx.save();
//     ctx.beginPath();
//     ctx.drawImage(img, 0,0, img.width, img.height,
//     centerShift_x, centerShift_y, img.width*ratio, img.height*ratio);  
//     ctx.rect(0, 0, img.width*ratio, img.height*ratio);
//     let borderColor = lightOrDark(colorMode.colorMode, "black", "white")
//     ctx.strokeStyle = borderColor;
//     ctx.stroke();
//     ctx.closePath()
//     ctx.restore();
// }

// const generateImage = async (positions, isMinted) => {
// const canvas = createCanvas(WIDTH, HEIGHT)

//     let ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     let backgroundImage =fs.readFileSync("src/assets/images/background.png")
//     let markImg;
//     if (isMinted)
//     markImg= fs.readFileSync("src/assets/images/mint.png")
//     else {
//     markImg = fs.readFileSync("src/assets/images/burn.png")
//     }
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     drawScaledImage(backgroundImage, ctx); 
//     ctx.drawImage(markImg, 290,270, 100, 20);
//     drawPixels(ctx, positions);
//     const buffer = canvas.toBuffer('image/png');

//     return buffer;
// }


// const puppersShare = async(req, res) => {
//     try {
//       const { puppers, isMinted } = req.body
//       let positions = [];
//     for(let i = 0 ; i < puppers.length; i ++) {
//       const [x, y] = pupperToPixelCoordsLocal(puppers[i]);
//       positions.push({
//         pupper: puppers[i],
//         x: x * SCALE  - PIXEL_WIDTH /2,
//         y: y* SCALE - PIXEL_HEIGHT /2
//       })
//     }
//     const buffer = generateImage(positions, isMinted);
//     fs.writeFileSync(`src/assets/images/test.png`, buffer);
//       res.send({
//         buffer,
//         url: 'src/assets/images/test.png'
//       })
//     } catch (e) {
//       next(e)
//     }
// }

// module.exports = {puppersShare};

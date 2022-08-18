const fs = require('fs')
const {createCanvas} = require('canvas')
const Canvas = require('canvas')
const AWS = require('aws-sdk');

const PIXEL_WIDTH = 20;
const PIXEL_HEIGHT = 20;
const WIDTH = 640;
const HEIGHT = 480;
const PIXEL_TO_ID_OFFSET = 1000000;

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


function pupperToIndexLocal(pupper) {
  return pupper - PIXEL_TO_ID_OFFSET
}

function pupperToPixelCoordsLocal(pupper) {
  const index = pupperToIndexLocal(pupper)
  return [index % WIDTH, Math.floor(index / WIDTH)]
}

const drawPixels = (ctx, puppers) => {
    const length = puppers.length;

    if (length < 1) return;

    ctx.save();
    let strokeColor =  "#4b0edd";
    ctx.beginPath();
    ctx.strokeStyle = strokeColor;

    for(let i = 0 ; i < length; i ++) {
        const [x, y] = pupperToPixelCoordsLocal(puppers[i]);
        ctx.rect(x, y, PIXEL_WIDTH, PIXEL_HEIGHT);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

const generateImage = async (puppers, isMinted) => {
    const canvas = createCanvas(WIDTH, HEIGHT)

    let ctx = canvas.getContext('2d');

    const backgroundImagedata =fs.readFileSync("src/assets/images/background.png")

    var backgroundImage = new Canvas.Image;
    backgroundImage.src = backgroundImagedata;
    
    let markImgData;
    if (isMinted)
        markImgData= fs.readFileSync("src/assets/images/mint.png")
    else {
        markImgData = fs.readFileSync("src/assets/images/burn.png")
    }
    const markImg = new Canvas.Image;
    markImg.src = markImgData;

    // drawScaledImage(backgroundImage, ctx); 
    ctx.drawImage(backgroundImage, 0,0, backgroundImage.width, backgroundImage.height)
    ctx.drawImage(markImg, 520,430, 100, 20)
    drawPixels(ctx, puppers);
    const buffer = canvas.toBuffer('image/png');

    return { buffer, dataURL: canvas.toDataURL() };
}

const puppersShare = async(req, res, next) => {
    try {
        const { puppers, isMinted } = req.body
        if (puppers.length == 0) {
            throw new Error("No puppers to share");
        }

        const response = await generateImage(puppers, isMinted);
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `${isMinted ? 'mint' : 'burn'}_${puppers[0]}.png`, // File name you want to save as in S3
            Body: response.buffer,
            CreateBucketConfiguration: {
                // Set your region here
                LocationConstraint: "eu-west-1"
            }
        };
        
        s3.upload(params, function(err, data) {
            if (err) {
                throw err;
            }
            res.send({
                image: response.dataURL,
                url: data.Location
            })
        });
    } catch (e) {
    next(e)
    }
}

module.exports = {puppersShare};

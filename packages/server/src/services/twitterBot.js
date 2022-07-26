const ethers = require('ethers')
const Jimp = require('jimp')
const Twitter = require('twitter');
const fs = require('fs')
const {createCanvas} = require('canvas')
const {
  twitter_consumer_key, twitter_consumer_secret, twitter_access_token_key, twitter_access_token_secret, app_env,
  isProd
} = require('../config/vars');
const {sentryClient} = require('./Sentry');
const KobosuJson = require('../constants/kobosu.json');
const logger = require("../config/config");

const PIXEL_OFFSET_X = 50;
const TOP_PIXEL_OFFSET_Y = 20;
const BOTTOM_PIXEL_OFFSET_Y = 350;
const PIXEL_WIDTH = 90;
const PIXEL_HEIGHT = 90;
const PIXEL_TEXT_HEIGHT = 30;
const WIDTH = 640;
const HEIGHT = 480;
const PIXEL_TO_ID_OFFSET = 1000000;
const SHADOW_THICK = 6;


var client = new Twitter({
  consumer_key: twitter_consumer_key,
  consumer_secret: twitter_consumer_secret,
  access_token_key: twitter_access_token_key,
  access_token_secret: twitter_access_token_secret
});

function pupperToIndexLocal(pupper) {
  return pupper - PIXEL_TO_ID_OFFSET
}

function pupperToPixelCoordsLocal(pupper) {
  const index = pupperToIndexLocal(pupper)
  return [index % WIDTH, Math.floor(index / WIDTH)]
}

function pupperToHexLocal(pupper) {
  const [x, y] = pupperToPixelCoordsLocal(pupper)
  return KobosuJson[y][x]
}

function getPixelOffsets(y) {
  if (y <= HEIGHT / 2) {
    return [PIXEL_OFFSET_X, BOTTOM_PIXEL_OFFSET_Y];
  } else {
    return [PIXEL_OFFSET_X, TOP_PIXEL_OFFSET_Y];
  }
}

/**
 * Generate Pixel image right drop shadow
 * @param {width of the drop shadow} width
 * @param {heigth of the drop shadow} heigth
 * @returns Jimp instance
 */
function generateShadow(width, height) {
  const blackNum = parseInt('000000' + 'ff', 16);
  let jimp = new Jimp(width, height);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      jimp.setPixelColor(blackNum, x, y); // draw border
    }
  }
  return jimp
}

/**
 * Generate Pixel image with WIDTH and HEIGTH based on the color
 * @param {color of Pixel image} color
 * @returns Jimp instance
 */
function generatePixelImage(color) {
  const hex = color.replace('#', '');
  const num = parseInt(hex + 'ff', 16);
  const blackNum = parseInt('000000' + 'ff', 16);
  const whiteNum = parseInt('fffced' + 'ff', 16);
  let jimp = new Jimp(PIXEL_WIDTH, PIXEL_HEIGHT + PIXEL_TEXT_HEIGHT);

  for (let x = 0; x < PIXEL_WIDTH; x++) {
    for (let y = 0; y < PIXEL_HEIGHT + PIXEL_TEXT_HEIGHT; y++) {
      if (x === 0 || x === PIXEL_WIDTH - 1 || y === 0 || y === PIXEL_HEIGHT - 1) {
        jimp.setPixelColor(blackNum, x, y); // draw border
      } else if (y < PIXEL_HEIGHT) {
        jimp.setPixelColor(num, x, y); // draw pixel image
      } else {
        jimp.setPixelColor(whiteNum, x, y); // draw white borad for coordinates
      }
    }
  }
  return jimp
}

/**
 * Draw and fill the pointers
 * @param {canvas context} ctx
 * @param {x of the fist pointer} x
 * @param {y of the first pointer} y
 * @param {x of the second pointer} x1
 * @param {y of the second pointer} y1
 * @param {x of the third pointer} x2
 * @param {y of the third pointer} y2
 * @returns canvas context
 */
function drawPointer(ctx, x, y, x1, y1, x2, y2) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x, y);
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  ctx.stroke();
  ctx.fill();

  ctx.closePath();

  return ctx;
}

/**
 * Draw pointer image and create png file
 * @param {token Id} tokenId
 * @param {tweet message} content
 */
function addPointerImage(tokenId, content) {
  try {
    const [x, y] = pupperToPixelCoordsLocal(tokenId)
    const [pixelOffsetX, pixelOffsetY] = getPixelOffsets(y);
    const canvas = createCanvas(WIDTH, HEIGHT)
    let context = canvas.getContext('2d')
    let y1;

    if (pixelOffsetY === BOTTOM_PIXEL_OFFSET_Y) {
      y1 = BOTTOM_PIXEL_OFFSET_Y;
    } else {
      y1 = TOP_PIXEL_OFFSET_Y + PIXEL_HEIGHT + PIXEL_TEXT_HEIGHT;
    }

    context = drawPointer(context, x, y, pixelOffsetX + 20, y1, pixelOffsetX + 45, y1);

    const buffer = canvas.toBuffer('image/png')
    fs.writeFile('src/assets/images/pointer.png', buffer, "", function () {
      uploadImageToTwitter(tokenId, content);
    })
  } catch (error) {
    logger.error(error.message)
    sentryClient.captureMessage(`Failed to add pointer image ${error.message}`)
  }
}

/**
 * merge background with pixel image and pointer image, and upload twitter
 * @param {token Id} tokenId
 * @param {tweet message} content
 */
async function uploadImageToTwitter(tokenId, content) {
  try {
    const [x, y] = pupperToPixelCoordsLocal(tokenId)
    const color = pupperToHexLocal(tokenId);

    const pointerImg = await Jimp.read('src/assets/images/pointer.png');
    let txtImg;

    if (content.includes('minted')) {
      txtImg = await Jimp.read('src/assets/images/mint.png');
    } else {
      txtImg = await Jimp.read('src/assets/images/burn.png');
    }
    Jimp.read('src/assets/images/background.png', async function (err, image) {
      // merge pixel image with background image
      const pixelImage = generatePixelImage(color);
      const [pixelOffsetX, pixelOffsetY] = getPixelOffsets(y);
      image = image.composite(pixelImage, pixelOffsetX, pixelOffsetY);

      // merge box shadow
      const rightShadow = generateShadow(SHADOW_THICK, PIXEL_HEIGHT + PIXEL_TEXT_HEIGHT);
      image = image.composite(rightShadow, pixelOffsetX + PIXEL_WIDTH, pixelOffsetY + SHADOW_THICK)
      const bottomShadow = generateShadow(PIXEL_WIDTH - SHADOW_THICK, SHADOW_THICK);
      image = image.composite(bottomShadow, pixelOffsetX + SHADOW_THICK, pixelOffsetY + PIXEL_HEIGHT + PIXEL_TEXT_HEIGHT)

      // merge pointer image with background image
      image = image.composite(pointerImg, 0, 0);

      // merge minted text image with background image
      image = image.composite(txtImg, 400, 430);

      // print coordinates
      const font = await Jimp.loadFont('src/assets/fonts/PressStart2P-Regular.ttf.fnt');
      image.print(font, pixelOffsetX + 5, pixelOffsetY + PIXEL_HEIGHT + 10, `(${x},${y})`);

      // get base64 image
      image.getBase64('image/png', function (error, base64image) {
        if (!error) {
          base64image = base64image.replace('data:image/png;base64,', '');

          // upload image to twitter
          client.post('media/upload', {media_data: base64image}, function (err, data, response) {
            if (!err) {
              let mediaId = data.media_id_string;
              tweetmessage(mediaId, content);
            } else {
              logger.error(`Error occured uploading image\t${err}`);
              logger.error(err)
              logger.error(JSON.stringify(err))
            }
          });
        } else {
          tweetmessage(0, content);
          logger.error(`Failed to get base64Image ${error.message}`);
        }
      });
    })
  } catch (error) {
    logger.error(error.message)
    sentryClient.captureMessage(`Failed to upload image ${error.message}`)
  }
}

/**
 * Tweet message with the image
 * @param {media id in twitter} media_id
 * @param {tweet message} content
 */
async function tweetmessage(media_id, content) {
  client.post('statuses/update',
    {
      status: content,
      media_ids: media_id
    },
    function (err) {
      if (err) {
        logger.error(`Error occured update status\t${JSON.stringify(err)}`);
        sentryClient.captureMessage(`Failed to tweet NFT ${err.message}`)
      } else {
        logger.info('Twitter message tweeted')
      }
    });
}

/**
 * Main function
 * Detect mint and burn events and tweet NFT information
 */
async function tweet(from, to, tokenId, provider) {
  logger.info(`Twitter listener triggered on transfer for token id: ${tokenId}`)
  try {
    if (from === ethers.constants.AddressZero || to === ethers.constants.AddressZero) {
      let initiator;
      if (from === ethers.constants.AddressZero) {
        initiator = 'minted';
      } else {
        initiator = 'burned';
      }

      const [x, y] = pupperToPixelCoordsLocal(tokenId);
      const user = initiator === 'minted' ? to : from;
      const ens = await provider.lookupAddress(user)

      let content = `Pixel (${x}, ${y}) ${initiator} by ${ens ? ens : user}`
      content += `\n${isProd ? 'pixels.ownthedoge.com' : 'dev.pixels.ownthedoge.com'}/px/${tokenId}`

      addPointerImage(tokenId, content);
    }
  } catch (error) {
    logger.error(error);
    sentryClient.captureMessage(`Failed to tweet ${error.message}`)
  }
}

module.exports = tweet;


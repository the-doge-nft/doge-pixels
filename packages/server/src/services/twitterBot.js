const ethers = require('ethers')
const Jimp = require('jimp')
const Twitter = require('twitter');

const { EthersClient } = require("../config/ethers")
const { consumer_key, consumer_secret, access_token_key, access_token_secret } = require('../config/vars');
const { sentryClient } = require('./Sentry');
const KobosuJson = require("../constants/kobosu.json");

var client = new Twitter({
	consumer_key: consumer_key,
	consumer_secret: consumer_secret,
	access_token_key: access_token_key,
	access_token_secret: access_token_secret
});

const PIXEL_TO_ID_OFFSET = 1000000;
const WIDTH = 640;

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

function generateImageObject(color) {
    const hex = color.replace('#','');
    const num = parseInt(hex+"ff", 16);
    let jimg = new Jimp(90, 90);
    for (let x=0; x< 90; x++) {
        for (let y=0; y< 90; y++) {
            jimg.setPixelColor(num, x, y);
        }
    }
    return jimg
}

async function uploadImageToTwitter(tokenId, content) {
    try {
        const color = pupperToHexLocal(tokenId);
        const jimg = generateImageObject(color);

        jimg.getBase64("image/png", function(error, base64image) {
            if (!error) {
                base64image = base64image.replace('data:image/png;base64,', '');
                
                client.post('media/upload', { media_data: base64image }, function (err, data, response) {
                    if (!err) {
                        let mediaId = data.media_id_string;
                        tweetmessage(mediaId, content);
                    } else {
                        console.log(`Error occured uploading image\t${err}`);
                    }
                    });
            } else {
                tweetmessage(0, content);
                console.log(`Failed to get base64Image ${error.message}`);
            }
        });
    } catch(error) {
        console.log(error.message)
        sentryClient.captureMessage(`Failed to upload image ${error.message}`)
        return '';
    }
}

async function tweetmessage(media_id, content) {
    client.post('statuses/update', 
        { 
            status: content, 
            media_ids: media_id
        },
        function (err, data, response) {
            if (err) {
                console.log(`Error occured update status\t${err}`);
            } else {
                console.log("success")
            }
        });
}

async function tweet() {
    EthersClient.PXContract.on("Transfer", async (from, to, tokenId, event) => {
        try {
            if (from === ethers.constants.AddressZero || to === ethers.constants.AddressZero) {
                let initiator;
                if (from === ethers.constants.AddressZero) {
                    initiator = "minted";
                } else {
                    initiator = "burned";
                }
                
                const [x, y] = pupperToPixelCoordsLocal(tokenId);
                const user = initiator === "minted" ? to : from;    
                
                let content = `Doge Pixel(${x}, ${y}) ${initiator} by ${user}`
                content += `\n pixels.ownthedoge.com/px/${tokenId}`
                
                uploadImageToTwitter(tokenId, content);
            }
        } catch (error) {
            console.log(error);
            sentryClient.captureMessage(`Failed to tweet ${error.message}`)
        }   
    });
}

module.exports = tweet;


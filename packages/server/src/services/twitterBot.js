const ethers = require('ethers')
const { EthersClient } = require("../config/ethers")
const Twitter = require('twitter');
const { consumer_key, consumer_secret, access_token_key, access_token_secret } = require('../config/vars');
const { sentryClient } = require('./Sentry');
const { default: axios } = require('axios');

var client = new Twitter({
	consumer_key: consumer_key,
	consumer_secret: consumer_secret,
	access_token_key: access_token_key,
	access_token_secret: access_token_secret
});

// async function getBase64ImageFromTokenURI(tokenURI) {
//     try {
//         const json = await axios.get(tokenURI);
//         console.log("Token Data", json.data.image)
//         const imageURL = json.data.image;
//         // const image = await axios.get(imageURL, {responseType: 'arraybuffer'});
//         // return Buffer.from(image.data).toString('base64');
//         const image = await getBase64FromUrl(imageURL);
//         return image;
//     } catch(error) {
//         sentryClient.captureMessage(`Failed to get image ${error.message}`)
//         return '';
//     }
// }

// const getBase64FromUrl = async (url) => {
//     try {
//         var request = require('request').defaults({ encoding: null });

//         const response = await request.get(url);
//         console.log({response})
//         return "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
//     } catch (err) {
//         console.log("Error in get base64Image " + err.message)
//     }
//   }
  

async function uploadImageToTwitter(tokenId, content) {
    try {
        const tokenURI = await EthersClient.PXContract.tokenURI(tokenId);

        const json = await axios.get(tokenURI);
        const imageURL = json.data.image;

        var request = require('request').defaults({ encoding: null });
        request.get(imageURL, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                const base64image = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
                console.log({base64image})
                client.post('media/upload', { media_data: base64image }, function (err, data, response) {
                    if (!err) {
                      let mediaId = data.media_id_string;
                      tweetmessage(mediaId, content);
                    } else {
                      console.log(`Error occured uploading image\t${err}`);
                    }
                  });
            } else {
                console.log("Error in getting image " + error.message)
                tweetmessage('', content);
            }
        });
        
        
    } catch(error) {
        sentryClient.captureMessage(`Failed to upload image ${error.message}`)
        return '';
    }
}

async function tweetmessage(media_id, content) {
    console.log({content})
    client.post('statuses/update', 
        { 
            status: content, 
            // media_ids: media_id
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
                
                
                const [x, y] = await EthersClient.PXContract.pupperToPixelCoords(tokenId);
                const user = initiator === "minted" ? to : from;    
                let content = `Doge Pixel(${x}, ${y}) ${initiator} by ${user}`
                content += `\n pixels.ownthedoge.com/px/${tokenId} `
                tweetmessage(11, content);
                // uploadImageToTwitter(tokenId, content);
            }
        } catch (error) {
            console.log(error);
            sentryClient.captureMessage(`Failed to tweet ${error.message}`)
        }   
    });
}

module.exports = tweet;


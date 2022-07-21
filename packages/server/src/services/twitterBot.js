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

async function uploadImageToTwitter(tokenId, content) {
    try {
        const tokenURI = await EthersClient.PXContract.tokenURI(tokenId);

        const json = await axios.get(tokenURI);
        const imageURL = json.data.image;

        var request = require('request').defaults({ encoding: null });
        request.get(imageURL, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                const base64image = Buffer.from(body).toString('base64');

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
                
                const [x, y] = await EthersClient.PXContract.pupperToPixelCoords(tokenId);
                const user = initiator === "minted" ? to : from;    
                
                let content = `Doge Pixel(${x}, ${y}) ${initiator} by ${user}`
                content += `\n pixels.ownthedoge.com/px/${tokenId} `
                uploadImageToTwitter(tokenId, content);
            }
        } catch (error) {
            console.log(error);
            sentryClient.captureMessage(`Failed to tweet ${error.message}`)
        }   
    });
}

module.exports = tweet;


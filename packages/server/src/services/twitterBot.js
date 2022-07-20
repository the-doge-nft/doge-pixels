const ethers = require('ethers')
const { EthersClient } = require("../config/ethers")
const Twitter = require('twitter');
const { consumer_key, consumer_secret, access_token_key, access_token_secret } = require('../config/vars');
const { sentryClient } = require('./Sentry');

var client = new Twitter({
	consumer_key: consumer_key,
	consumer_secret: consumer_secret,
	access_token_key: access_token_key,
	access_token_secret: access_token_secret
});

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
                const tokenURI = await EthersClient.PXContract.tokenURI(tokenId);
                //0xA26461Fcf53f3E21cde8c902CA6e8e6ba9Def62f
                const media = await uploadClient.post('media/upload', { media_data: base64image })
                const [x, y] = await EthersClient.PXContract.pupperToPixelCoords(tokenId);    
                let content = `Doge Pixel(${x}, ${y}) ${initiator} by ${to}`
                content += `<br/> <a href="pixels.ownthedoge.com/px/${tokenId}" target="_blank" />`
                await client.post('statuses/update', 
                    { 
                        status: content, 
                        media_ids: media.media_id_string 
                    }
                )
            }
        } catch (error) {
            console.log(error);
            sentryClient.captureMessage(`Failed to tweet ${error.message}`)
        }   
    });
}
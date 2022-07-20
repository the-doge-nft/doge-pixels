const ethers = require('ethers')
const { EthersClient } = require("../config/ethers")
const Twitter = require('twitter');
const { consumer_key, consumer_secret, access_token_key, access_token_secret } = require('../config/vars');

var client = new Twitter({
	consumer_key: consumer_key,
	consumer_secret: consumer_secret,
	access_token_key: access_token_key,
	access_token_secret: access_token_secret
});
const MintFilter = {
    address: EthersClient.PXContract,
    topics: [
        // the name of the event, parnetheses containing the data type of each event, no spaces
        utils.id("Transfer(address,address,uint256)"),
        hexZeroPad(ethers.constants.AddressZero, 32)
    ]
}
const BurnFilter = {
    address: EthersClient.PXContract,
    topics: [
        // the name of the event, parnetheses containing the data type of each event, no spaces
        utils.id("Transfer(address,address,uint256)"),
        null,
        hexZeroPad(ethers.constants.AddressZero, 32)
    ]
}
const TransferFilter = {
    address: EthersClient.PXContract,
    topics: [
        // the name of the event, parnetheses containing the data type of each event, no spaces
        utils.id("Transfer(address,address,uint256)"),
    ]
}

async function tweet() {
    EthersClient.provider.on(TransferFilter, (log, event) => {
        console.log({event})
    })
}
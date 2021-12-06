const ethers = require('ethers')
const { env } = require('./vars')
const ABI = require('../contracts/hardhat_contracts.json')
const testABI = require('../../test/contracts/hardhat_contracts.json')
const logger = require("./config");
const vars = require("./vars");

let pxContractInfo
let network

if (env === "development") {
  network = "rinkeby"
  pxContractInfo = ABI["4"][network]["contracts"]["PX"]
} else if (env === "test") {
  network = "localhost"
  pxContractInfo = testABI["31337"][network]["contracts"]["PX"]
} else {
  network = "rinkeby"
  pxContractInfo = ABI["4"][network]["contracts"]["PX"]
}

let provider

logger.info(`init infura connection on network: ${network}`)
if (env === "test") {
  provider = new ethers.providers.WebSocketProvider(`ws://127.0.0.1:8545`);
} else {
  provider = new ethers.providers.WebSocketProvider(vars.infura_ws_endpoint, network);
}

const PXContract = new ethers.Contract(pxContractInfo["address"], pxContractInfo["abi"], provider)

module.exports = {provider, PXContract}

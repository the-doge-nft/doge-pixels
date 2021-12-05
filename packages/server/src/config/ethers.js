const ethers = require('ethers')
const { env, infura_project_id, infura_secret_id } = require('./vars')
const ABI = require('../contracts/hardhat_contracts.json')
const testABI = require('../../test/contracts/hardhat_contracts.json')
const logger = require("./config");

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
  // throw Error("Not ready for production yet")
}

let provider

logger.info(`init infura connection on network: ${network}`)
if (env === "test") {
  // provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545")
  provider = new ethers.providers.WebSocketProvider(`ws://127.0.0.1:8545`);
} else {
  // provider = new ethers.providers.InfuraProvider(network=network, apiKey={
  //   projectId: infura_project_id,
  //   projectSecret: infura_secret_id
  // })
  provider = new ethers.providers.WebSocketProvider(`ws://rinkeby.infura.io/ws/v3/${infura_project_id}`, network);
}
// const provider = new ethers.providers.InfuraProvider.getWebSocketProvider(network=network, apiKey=infura_secret_id)

const PXContract = new ethers.Contract(pxContractInfo["address"], pxContractInfo["abi"], provider)

module.exports = {provider, PXContract}

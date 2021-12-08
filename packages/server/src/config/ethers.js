const ethers = require('ethers')
const { env } = require('./vars')
const ABI = require('../contracts/hardhat_contracts.json')
const testABI = require('../../test/contracts/hardhat_contracts.json')
const logger = require("./config");
const vars = require("./vars");
const Sentry = require("@sentry/node");
const {keepAlive} = require("./helpers");

let pxContractInfo
let dogContractInfo
let network
let provider


if (env === "production") {
  network = "rinkeby"
  pxContractInfo = ABI["4"][network]["contracts"]["PX"]
  dogContractInfo = ABI["4"][network]["contracts"]["DOG20"]
} else if (env === "test") {
  network = "localhost"
  pxContractInfo = testABI["31337"][network]["contracts"]["PX"]
  dogContractInfo = testABI["31337"][network]["contracts"]["DOG20"]
} else {
  network = "rinkeby"
  pxContractInfo = ABI["4"][network]["contracts"]["PX"]
  dogContractInfo = ABI["4"][network]["contracts"]["DOG20"]
}

const startProviderListener = () => {
  logger.info(`Creating WS provider on network: ${network}`)
  if (env === "test") {
    provider = new ethers.providers.WebSocketProvider(`ws://127.0.0.1:8545`);
  } else {
    provider = new ethers.providers.WebSocketProvider(vars.infura_ws_endpoint, network);
    // provider = new ethers.providers.InfuraProvider(network=network, apiKey={
    //   projectId: vars.infura_project_id,
    //   projectSecret: vars.infura_secret_id
    // })
  }
  keepAlive({
    provider,
    onDisconnect: (err) => {
      const debugString = `The ws connection was closed: ${JSON.stringify(err, null, 2)}`
      logger.error(debugString);
      Sentry.captureMessage(debugString)
      startProviderListener()
    }
  })
}

startProviderListener()

const PXContract = new ethers.Contract(pxContractInfo["address"], pxContractInfo["abi"], provider)
const DOGContract = new ethers.Contract(dogContractInfo["address"], dogContractInfo["abi"], provider)

module.exports = {provider, PXContract, DOGContract}

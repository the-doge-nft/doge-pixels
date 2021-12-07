const ethers = require('ethers')
const { env } = require('./vars')
const ABI = require('../contracts/hardhat_contracts.json')
const testABI = require('../../test/contracts/hardhat_contracts.json')
const logger = require("./config");
const vars = require("./vars");
const Sentry = require("@sentry/node");
const {keepAlive} = require("./helpers");

let pxContractInfo
let network
let provider


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

const startProviderListener = () => {
  logger.info(`Creating WS provider on network: ${network}`)
  if (env === "test") {
    provider = new ethers.providers.WebSocketProvider(`ws://127.0.0.1:8545`);
  } else {
    provider = new ethers.providers.WebSocketProvider(vars.infura_ws_endpoint, network);
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

module.exports = {provider, PXContract}

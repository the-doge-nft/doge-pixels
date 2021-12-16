const ethers = require('ethers')
const { env } = require('./vars')
const ABI = require('../contracts/hardhat_contracts.json')
const testABI = require('../../test/contracts/hardhat_contracts.json')
const logger = require("./config");
const vars = require("./vars");
const Sentry = require("@sentry/node");
const {keepAlive} = require("./helpers");
const {getAddressToOwnershipMap} = require("../api/web3/px");


class EthersHandler {
  constructor() {
    let network, pxContractInfo, dogContractInfo
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
    this.network = network
    this.pxContractInfo = pxContractInfo
    this.dogContractInfo = dogContractInfo
    this.initWS()
  }

  initWS() {
    const connectingMessage = `Creating WS provider on network: ${this.network}`
    logger.info(connectingMessage)
    Sentry.captureMessage(connectingMessage)
    if (env === "test") {
      this.provider = new ethers.providers.WebSocketProvider(`ws://127.0.0.1:8545`);
    } else {
      this.provider = new ethers.providers.WebSocketProvider(vars.infura_ws_endpoint, this.network);
    }

    this.PXContract = new ethers.Contract(this.pxContractInfo["address"], this.pxContractInfo["abi"], this.provider)
    this.DOGContract = new ethers.Contract(this.dogContractInfo["address"], this.dogContractInfo["abi"], this.provider)

    // rebuild ownership map in redis to be safe
    getAddressToOwnershipMap(this)

    // listen out for transfers on the PX contract
    const listenDebugString = `Listening to PX contract: ${this.PXContract.address} 👂`
    logger.info(listenDebugString)
    Sentry.captureMessage(listenDebugString)
    this.PXContract.on('Transfer(address,address,uint256)', async (from, to, _tokenID) => {
      logger.info("PX transfer detected - rebuilding address to token ID map")
      getAddressToOwnershipMap(this)
    })

    // keep ws alive, re-initialize if connection is dropped
    keepAlive({
      provider: this.provider,
      onDisconnect: (err) => {
        const debugString = `The ws connection was closed: ${JSON.stringify(err, null, 2)}`
        logger.error(debugString);
        Sentry.captureMessage(debugString)
        this.initWS()
      }
    })
  }
}

EthersClient = new EthersHandler()

module.exports = {EthersClient}

const ethers = require('ethers')
const { app_env, infura_ws_endpoint } = require('./vars')
const ABI = require('../contracts/hardhat_contracts.json')
const testABI = require('../../test/contracts/hardhat_contracts.json')
const logger = require("./config");
const {keepAlive} = require("./helpers");
const {getAddressToOwnershipMap} = require("../api/web3/px");
const {sentryClient} = require("../services/Sentry");
const debounce = require("lodash.debounce")
const {tweet} = require("../services/twitterBot");
const discordBot = require("../services/discordBot");

class EthersHandler {
  constructor() {
    let network, pxContractInfo, dogContractInfo
    if (app_env === "production") {
      network = "mainnet"
      pxContractInfo = ABI["1"][network]["contracts"]["PX"]
      dogContractInfo = ABI["1"][network]["contracts"]["DOG20"]
    } else if (app_env === "development") {
      network = "rinkeby"
      pxContractInfo = ABI["4"][network]["contracts"]["PX"]
      dogContractInfo = ABI["4"][network]["contracts"]["DOG20"]
    } else if (app_env === "test") {
      network = "localhost"
      pxContractInfo = testABI["31337"][network]["contracts"]["PX"]
      dogContractInfo = testABI["31337"][network]["contracts"]["DOG20"]
    } else {
      throw Error("App environment not recognized")
    }
    this.network = network
    this.pxContractInfo = pxContractInfo
    this.dogContractInfo = dogContractInfo
    this.initWS()
  }

  getAddressMap() {
    return getAddressToOwnershipMap(this)
  }

  initWS() {
    const connectingMessage = `Creating WS provider on network: ${this.network}`
    logger.info(connectingMessage)
    sentryClient.captureMessage(connectingMessage)
    if (app_env === "test") {
      this.provider = new ethers.providers.WebSocketProvider(`ws://127.0.0.1:8545`);
    } else {
      this.provider = new ethers.providers.WebSocketProvider(infura_ws_endpoint, this.network);
    }

    this.PXContract = new ethers.Contract(this.pxContractInfo["address"], this.pxContractInfo["abi"], this.provider)
    this.DOGContract = new ethers.Contract(this.dogContractInfo["address"], this.dogContractInfo["abi"], this.provider)

    // build initial map
    // this.getAddressMap()

    const listenDebugString = `Listening to PX contract: ${this.PXContract.address} 👂`
    logger.info(listenDebugString)
    sentryClient.captureMessage(listenDebugString)

    // update the address map on transfer
    this.PXContract.on('Transfer', async (from, to, tokenId, event) => {
      logger.info(`Transfer callback hit for: ${tokenId}`)
      debounce(this.getAddressMap.bind(this), 500, {maxWait: 2 * 1000})
      tweet(from, to, tokenId, this.provider)
      discordBot(from, to, tokenId, this.provider)
    })

    if (app_env !== "test") {
      keepAlive({
        provider: this.provider,
        onDisconnect: (err) => {
          const debugString = `The ws connection was closed: ${JSON.stringify(err, null, 2)}`
          logger.error(debugString);
          sentryClient.captureMessage(debugString);
          this.initWS();
        }
      })
    }
  }
}

EthersClient = new EthersHandler()

module.exports = {EthersClient}

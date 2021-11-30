const ethers = require("ethers")
const { provider, PXContract } = require("../../config/ethers")
const {redisClient, keys} = require("../../config/redis")
const logger = require("../../config/config");


async function main() {
  getAddressToOwnershipMap()
  listenToPXTransfers()
}

function addRemoveAddresses(source, from, to, tokenID) {
  if (typeof source !== "object") {
    throw Error("source must be an object")
  }
  const copy = JSON.parse(JSON.stringify(source))
  const isBurn = to === ethers.constants.AddressZero && from !== ethers.constants.AddressZero
  const isMint = to !== ethers.constants.AddressZero && from === ethers.constants.AddressZero

  if (isMint) {
    if (to in copy) {
      if (!copy[to].includes(tokenID)) {
        logger.info(`processing mint: adding token ${tokenID} to ${to}`)
        copy[to].push(tokenID)
      }
    } else {
      logger.info(`first processing mint: init token ${tokenID} to ${to}`)
      copy[to] = [tokenID]
    }
  }

  if (isBurn) {
    if (from in copy) {
      if (copy[from].includes(tokenID)) {
        logger.info(`processing burn: removing token ${tokenID} from ${from}`)
        const index = copy[from].indexOf(tokenID)
        copy[from].splice(index, 1)
      }
    }
  } else {
    logger.info(`processing burn: should not hit`)
    copy[from] = []
  }

  if (isBurn) {
    logger.info(`burn 🔥: ${from} [${tokenID}]`)
  } else if (isMint) {
    logger.info(`mint 🍵: ${to} [${tokenID}]`)
  } else {
    logger.info(`⚠️ unknown Transfer: from - ${from} - to ${to}`)
  }

  return copy
}

function listenToPXTransfers () {
  /*
    Listening to transfer events on the PX contract updating the address -> [tokenIDs...] stored in redis
   */
  logger.info(`Listening to PX contract: ${PXContract.address} on ${provider.network.name} 👂`)

  PXContract.on('Transfer', async (from, to, _tokenID) => {
    // const tokenID = _tokenID.toNumber()
    // const data = await redisClient.get(keys.ADDRESS_TO_TOKENID)
    // const source = JSON.parse(data)
    // const dest = JSON.stringify(addRemoveAddresses(source, from, to, tokenID))
    // redisClient.set(keys.ADDRESS_TO_TOKENID, dest)

    getAddressToOwnershipMap()
  })
}

async function getAddressToOwnershipMap() {
  /*
    Builds address -> [tokenIDs..] object for all of PX contract's history
   */
  logger.info(`Building address to Token ID map ⚒️`)

  addressToPuppers = {}
  const filter = PXContract.filters.Transfer(null, null)
  const logs = await PXContract.queryFilter(filter)
  logs.forEach(tx => {
    const {from, to} = tx.args
    const tokenID = tx.args.tokenId.toNumber()
    addressToPuppers = addRemoveAddresses(addressToPuppers, from, to, tokenID)
  })
  redisClient.set(keys.ADDRESS_TO_TOKENID, JSON.stringify(addressToPuppers))
}

module.exports = main

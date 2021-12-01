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
  const isBurn = (to === ethers.constants.AddressZero)
  const isMint = (from === ethers.constants.AddressZero)

  if (isMint) {
    if (to in copy) {
      if (!copy[to].includes(tokenID)) {
        logger.info(`mint 🍵: ${to} [${tokenID}]`)
        copy[to].push(tokenID)
      }
    } else {
      logger.info(`mint 🍵: ${to} [${tokenID}]`)
      copy[to] = [tokenID]
    }
  } else if (isBurn) {
    if (from in copy) {
      if (copy[from].includes(tokenID)) {
        logger.info(`burn 🔥: ${from} [${tokenID}]`)
        const index = copy[from].indexOf(tokenID)
        copy[from].splice(index, 1)
      }
    }
    else {
      logger.info(`burn 🔥: should not hit ${from} [${tokenID}]`)
      copy[from] = []
    }
  }

  return copy
}

function listenToPXTransfers () {
  /*
    Listening to transfer events on the PX contract updating the address -> [tokenIDs...] stored in redis
   */
  logger.info(`Listening to PX contract: ${PXContract.address} on ${provider.network.name} 👂`)

  // @TODO: this misses sometimes
  // https://github.com/ethers-io/ethers.js/discussions/2167
  PXContract.on('Transfer(address,address,uint256)', (from, to, _tokenID) => {
    getAddressToOwnershipMap()




    // @TODO events hit here to update blob, redis is not always synchronous, need a queue for processing
    // const tokenID = _tokenID.toNumber()
    // const data = await redisClient.get(keys.ADDRESS_TO_TOKENID)
    // const source = JSON.parse(data)
    // const dest = JSON.stringify(addRemoveAddresses(source, from, to, tokenID))
    // redisClient.set(keys.ADDRESS_TO_TOKENID, dest)
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
  await redisClient.set(keys.ADDRESS_TO_TOKENID, JSON.stringify(addressToPuppers))
}

module.exports = main

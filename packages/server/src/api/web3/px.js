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

  if (to in copy) {
    if (!copy[to].includes(tokenID)) {
      copy[to].push(tokenID)
    }
  } else {
    copy[to] = [tokenID]
  }

  if (from in copy) {
    if (copy[to].includes(tokenID)) {
      const index = copy[from].indexOf(tokenID)
      copy[from].splice(index, 1)
    }
  }
  else {
    copy[from] = []
  }

  if (to === ethers.constants.AddressZero) {
    logger.info(`burn 🔥: ${from} [${tokenID}]`)
  } else if (from === ethers.constants.AddressZero) {
    logger.info(`mint 🍵: ${to} [${tokenID}]`)
  }

  return copy
}

function listenToPXTransfers () {
  /*
    Listening to transfer events on the PX contract updating the address -> [tokenIDs...] stored in redis
   */
  logger.info(`Listening to PX contract: ${PXContract.address} on ${provider.network.name} 👂`)

  PXContract.on('Transfer', async (from, to, _tokenID) => {
    const tokenID = _tokenID.toNumber()
    const data = await redisClient.get(keys.ADDRESS_TO_TOKENID)
    const source = JSON.parse(data)
    const dest = JSON.stringify(addRemoveAddresses(source, from, to, tokenID))
    redisClient.set(keys.ADDRESS_TO_TOKENID, dest)
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

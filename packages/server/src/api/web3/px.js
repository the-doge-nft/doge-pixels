const ethers = require("ethers")
const { provider, PXContract } = require("../../config/ethers")
const {redisClient} = require("../../config/redis")
const logger = require("../../config/config");
const {env} = require("../../config/vars");


async function main() {
  getAddressToOwnershipMap()
  listenToPXTransfers()
}

async function addRemoveAddresses(source, from, to, tokenID) {
  if (typeof source !== "object") {
    throw Error("source must be an object")
  }
  const copy = JSON.parse(JSON.stringify(source))
  const isBurn = (to === ethers.constants.AddressZero)
  const isMint = (from === ethers.constants.AddressZero)

  // remove from *from* index
  if (from in copy) {
    if (copy[from].tokenIDs.includes(tokenID)) {
      const index = copy[from].tokenIDs.indexOf(tokenID)
      copy[from].tokenIDs.splice(index, 1)
    }
  } else {
    copy[from] = {tokenIDs: []}
  }

  // add to *to* index
  if (to in copy) {
    if (!copy[to].tokenIDs.includes(tokenID)) {
      copy[to].tokenIDs.push(tokenID)
    }
  } else {
    copy[to] = {tokenIDs: [tokenID]}
  }

  if (isMint) {
    debugString = "🍵 mint: "
  } else if (isBurn) {
    debugString = "🔥 burn: "
  } else {
    debugString = "🚡 user transfer: "
  }
  debugString += `${tokenID}: ${from} -> ${to}`
  logger.info(debugString)
  return copy
}

async function applyENSName(source) {
  if (typeof source !== "object") {
    throw Error("source must be an object")
  }
  const copy = JSON.parse(JSON.stringify(source))
  const EMPTY_ENS_STRING = 'NONE'

  for (const address in source) {
    if (source.hasOwnProperty(address)) {
      const cachedENS = await redisClient.hGet(redisClient.keys.ENS_LOOKUP, address)
      if (cachedENS == null) {
        const lookupENS = await provider.lookupAddress(address);
        if (lookupENS) {
          await redisClient.hSet(redisClient.keys.ENS_LOOKUP, address, lookupENS)
          copy[address].ens = lookupENS
        } else  {
          await redisClient.hSet(redisClient.keys.ENS_LOOKUP, address, EMPTY_ENS_STRING)
          copy[address].ens = null
        }
      }
    }
  }

  return copy
}

function listenToPXTransfers() {
  /*
    Listening to transfer events on the PX contract updating the address -> [tokenIDs...] stored in redis
    ⚠️ NOTE: do not depend on this listener - it randomly does not fire on some Transfer events. We persist
             it here to *hopefull* pick up any transfers happening external to our UI
   */
  logger.info(`Listening to PX contract: ${PXContract.address} 👂`)
  PXContract.on('Transfer(address,address,uint256)', async (from, to, _tokenID) => {
    logger.info("PX transfer detected - rebuilding address to token ID map")
    getAddressToOwnershipMap()
  })
}

async function getAddressToOwnershipMap() {
  /*
    Builds address -> [tokenIDs..] object for all of PX contract's history
   */
  logger.info(`Building initial address to token ID map ⚒️`)

  // refresh ENS names
  await redisClient.del(redisClient.keys.ENS_LOOKUP)

  let addressToPuppers = {}
  const filter = PXContract.filters.Transfer(null, null)
  const logs = await PXContract.queryFilter(filter)

  for (const tx of logs) {
    const {from, to} = tx.args
    const tokenID = tx.args.tokenId.toNumber()
    addressToPuppers = await addRemoveAddresses(addressToPuppers, from, to, tokenID)
  }

  if (env !== "test") {
    addressToPuppers = await applyENSName(addressToPuppers)
  }

  await redisClient.set(redisClient.keys.ADDRESS_TO_TOKENID, JSON.stringify(addressToPuppers))
}

module.exports = {main, getAddressToOwnershipMap}

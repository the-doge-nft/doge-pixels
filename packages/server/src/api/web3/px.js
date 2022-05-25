const ethers = require("ethers")
const {redisClient} = require("../../config/redis")
const logger = require("../../config/config");
const {env} = require("../../config/vars");
const vars = require("../../config/vars");


function removeZeroAddress(source) {
  const copy = JSON.parse(JSON.stringify(source))
  delete copy[ethers.constants.AddressZero]
  return copy
}

function sortTokenIDsByAscendingTime(source) {
  /*
    getLogs() returns logs from past -> present. reverse tokenIds in their
    respective arrays so newest are at the front and oldest are at the end
  */
  const copy = JSON.parse(JSON.stringify(source))
  for (const address in source) {
    copy[address].tokenIDs.reverse()
  }
  return copy
}

async function addRemoveAddresses(source, from, to, tokenID) {
  if (typeof source !== "object") {
    throw Error("source must be an object")
  }
  const copy = JSON.parse(JSON.stringify(source))

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

  const isBurn = (to === ethers.constants.AddressZero)
  const isMint = (from === ethers.constants.AddressZero)

  if (isMint) {
    debugString = "🍵 mint: "
    await redisClient.del(redisClient.getTokenMetadataKey(tokenID))
  } else if (isBurn) {
    debugString = "🔥 burn: "
    await redisClient.del(redisClient.getTokenMetadataKey(tokenID))
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
        const lookupENS = await EthersClient.provider.lookupAddress(address);
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


async function getAddressToOwnershipMap(EthersClient) {
  /*
    Builds address -> [tokenIDs..] object for all of PX contract's history
   */
  logger.info(`Building address to token ID map ⚒️`)

  // refresh ENS names
  await redisClient.del(redisClient.keys.ENS_LOOKUP)

  let addressToPuppers = {}
  const filter = EthersClient.PXContract.filters.Transfer(null, null)
  const fromBlock = Number(vars.contract_block_number_deployment)
  const toBlock = (await EthersClient.provider.getBlock()).number

  // infura limits the response to 10k items per response. we grab them in chunks here
  // https://docs.infura.io/infura/networks/ethereum/json-rpc-methods/eth_getlogs
  let logs = []
  const step = 50000
  logger.info(`beginning to process block range: ${fromBlock} -> ${toBlock}`)
  for (let i = fromBlock; i <= toBlock; i += step + 1) {
    logger.info(`processing from: ${i} to ${i + step}`)
    const _logs = await EthersClient.PXContract.queryFilter(filter, i, i+step)
    logs.push(..._logs)
  }

  for (const tx of logs) {
    const {from, to} = tx.args
    const tokenID = tx.args.tokenId.toNumber()
    addressToPuppers = await addRemoveAddresses(addressToPuppers, from, to, tokenID)
  }

  if (env !== "test") {
    addressToPuppers = await applyENSName(addressToPuppers)
  }

  // remove burned pixels from ownership map for now
  addressToPuppers = removeZeroAddress(addressToPuppers)
  addressToPuppers = sortTokenIDsByAscendingTime(addressToPuppers)

  await redisClient.set(redisClient.keys.ADDRESS_TO_TOKENID, JSON.stringify(addressToPuppers))
}

module.exports = {getAddressToOwnershipMap}

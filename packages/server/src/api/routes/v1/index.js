const express = require('express')
const {redisClient} = require('../../../config/redis')
const {PXContract, provider, DOGContract, getProvider, getDOGContract, EthersClient} = require("../../../config/ethers");
const logger = require("../../../config/config");
const {getAddressToOwnershipMap} = require("../../web3/px");
const {ethers} = require("ethers");

const router = express.Router()

router.get(
  '/status',
  (req, res) => res.send('A-OKAY')
)

router.get(
  '/config',
  async (req, res) => {
    const data = await redisClient.get(redisClient.keys.ADDRESS_TO_TOKENID)
    res.send(JSON.parse(data))
  }
)

router.get(
  '/config/refresh',
  async (req, res) => {
    await getAddressToOwnershipMap()
    const data = await redisClient.get(redisClient.keys.ADDRESS_TO_TOKENID)
    res.send(JSON.parse(data))
  }
)

router.get(
  '/px/dimensions',
  async (req, res) => {
    const cache = await redisClient.get(redisClient.keys.SHIBA_DIMENSIONS)
    if (cache) {
      res.send(JSON.parse(cache))
    } else {
      const width = await EthersClient.PXContract.SHIBA_WIDTH()
      const height = await EthersClient.PXContract.SHIBA_HEIGHT()
      const data = {width: width.toNumber(), height: height.toNumber()}
      redisClient.set(redisClient.keys.SHIBA_DIMENSIONS, JSON.stringify(data))
      res.send(data)
    }
  }
)

router.get(
  '/px/balance/:address',
  async (req, res) => {
    //@TODO: check if ETH address is valid
    //@TODO: could pull balance from keys.ADDRESS_TO_TOKENID
    const { address } = req.params
    const balance = await EthersClient.PXContract.balanceOf(address)
    if (balance) {
      res.send({balance: balance.toNumber()})
    } else {
      res.send({balance: 0})
    }
  }
)

router.get(
  '/px/owner/:tokenID',
  async (req, res, next) => {
    const { tokenID } = req.params
    logger.info(`querying token ID ${tokenID}`)
    try {
      const data = await redisClient.get(redisClient.keys.ADDRESS_TO_TOKENID)
      if (data) {
        const check = JSON.parse(data)
        for (const address in check) {
          if (check[address] && check[address].tokenIDs) {
            if (check[address].tokenIDs.includes(Number(tokenID))) {
              return res.send({address})
            }
          }
        }
      }

      throw Error()
    } catch (e) {
      e.message = "No address found"
      next(e)
    }
  }
)

router.get(
  '/ens/:address',
  async (req, res, next) => {
    try {
      const { address } = req.params
      const ens = await EthersClient.provider.lookupAddress(address)
      res.send({ens: ens})
    } catch (e) {
      next(e)
    }
  }
)

router.get(
  '/dog/locked',
  async (req, res, next) => {
    try {
      const balance = await EthersClient.DOGContract.balanceOf(EthersClient.PXContract.address)
      res.send({balance: ethers.utils.formatEther(balance)})
    } catch (e) {
      next(e)
    }
  }
)

module.exports = router;


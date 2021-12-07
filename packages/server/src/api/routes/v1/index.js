const express = require('express')
const {redisClient} = require('../../../config/redis')
const {PXContract, provider} = require("../../../config/ethers");
const logger = require("../../../config/config");
const {getAddressToOwnershipMap} = require("../../web3/px");

const router = express.Router()

router.get(
  '/status',
  (req, res) => res.send('u did it')
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
      const width = await PXContract.SHIBA_WIDTH()
      const height = await PXContract.SHIBA_HEIGHT()
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
    const balance = await PXContract.balanceOf(address)
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
      // const owner = await PXContract.ownerOf(tokenID)
      // return res.send({address: owner})

      const data = await redisClient.get(redisClient.keys.ADDRESS_TO_TOKENID)
      if (data) {
        const check = JSON.parse(data)
        for (const address in check) {
          if (check[address] && check[address].tokenIDs) {
            if (check[address].tokenIDs.includes(Number(tokenID))) {
              res.send({address})
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
      const ens = await provider.lookupAddress(address)
      res.send({ens: ens})
    } catch (e) {
      console.log(e)
      next(e)
    }
  }
)

router.get(
  '/test',
  async (req, res) => res.send('dev_update_4')
)

module.exports = router;


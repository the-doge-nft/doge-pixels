const express = require('express')
const {redisClient, keys} = require('../../../config/redis')
const {PXContract} = require("../../../config/ethers");

const router = express.Router()

router.get(
  '/status',
  (req, res) => res.send('OK')
)

router.get(
  '/config',
  async (req, res) => {
    const data = await redisClient.get(keys.ADDRESS_TO_TOKENID)
    res.send(JSON.parse(data))
  }
)

router.get(
  '/px/dimensions',
  async (req, res) => {
    const cache = await redisClient.get(keys.SHIBA_DIMENSIONS)
    if (cache) {
      res.send(JSON.parse(cache))
    } else {
      const width = await PXContract.SHIBA_WIDTH()
      const height = await PXContract.SHIBA_HEIGHT()
      const data = {width: width.toNumber(), height: height.toNumber()}
      redisClient.set(keys.SHIBA_DIMENSIONS, JSON.stringify(data))
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
  '/test',
  async (req, res) => res.send('dev_update_3')
)

module.exports = router;


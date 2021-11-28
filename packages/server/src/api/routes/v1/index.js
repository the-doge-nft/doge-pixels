const express = require('express')
const redisClient = require('../../../config/redis')
const { keys } = require("../../web3/px")

const router = express.Router()

router.get(
  '/status',
  (req, res) => res.send('OK')
)

router.get(
  '/config',
  async (req, res) => {
    const data = await redisClient.get(keys.ADDRESS_TOKENID_REDIS_KEY)
    res.send(JSON.parse(data))
  }
)

router.get(
  '/test',
  async (req, res) => res.send('good')
)

module.exports = router;


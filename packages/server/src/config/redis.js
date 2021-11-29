const redis = require('redis')

const redisClient = redis.createClient()
redisClient.on('error', err => console.log('Redis client error', err))

redisClient.connect()

const ADDRESS_TO_TOKENID = "ADDRESS_TO_TOKEN_ID"
const SHIBA_DIMENSIONS = "SHIBA_DIMENSIONS"

module.exports = {redisClient, keys: {ADDRESS_TO_TOKENID, SHIBA_DIMENSIONS}}

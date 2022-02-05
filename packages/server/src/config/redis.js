const redis = require('redis')
const {env} = require("./vars");
const logger = require("./config");

class RedisKeys {
  constructor() {
    this.ADDRESS_TO_TOKENID = "ADDRESS_TO_TOKEN_ID"
    this.SHIBA_DIMENSIONS = "SHIBA_DIMENSIONS"
    this.ENS_LOOKUP = "ENS:LOOKUP"
    this.TOKEN_METADATA = "METATDATA:"
  }
}

class RedisClient {

  constructor() {
    this.client = redis.createClient()
    this.client.on('error', err => logger.error(err))
    this.client.connect()
    this.keys = new RedisKeys()
  }

  getTokenMetadataKey(tokenID) {
    return this.keys.TOKEN_METADATA + tokenID
  }

  get(key) {
    return this.client.get(key)
  }

  set(key, value) {
    return this.client.set(key, value)
  }

  hGet(key, index) {
    return this.client.hGet(key, index)
  }

  hSet(key, index, value) {
    return this.client.hSet(key, index, value)
  }

  del(key) {
    return this.client.del(key)
  }
}

redisClient = new RedisClient()

module.exports = {redisClient}

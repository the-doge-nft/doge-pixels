const { port, env } = require('./config/vars')
const {getAddressToOwnershipMap}  = require('./api/web3/px')
const app = require('./config/express');
const logger = require("./config/config");
const {redisClient} = require("./config/redis")
const {EthersClient} = require("./config/ethers");

redisClient.client.on('connect', () => {
  logger.info("Redis connected")
  app.listen(port, () => logger.info(`Server started on port: ${port}`))
})

module.exports = app;

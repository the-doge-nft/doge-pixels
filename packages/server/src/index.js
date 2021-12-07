const { port, env } = require('./config/vars')
const {main: pxMain}  = require('./api/web3/px')
const app = require('./config/express');
const logger = require("./config/config");
const {redisClient} = require("./config/redis")

redisClient.client.on('connect', () => {
  logger.info("Redis connected")
  app.listen(port, () => logger.info(`Server started on port: ${port}`))
  pxMain()
})

module.exports = app;

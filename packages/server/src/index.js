const { port, env } = require('./config/vars')
const pxMain  = require('./api/web3/px')
const app = require('./config/express');
const logger = require("./config/config");
const {redisClient} = require("./config/redis")

redisClient.on('connect', () => {
  app.listen(port, () => logger.info(`server started on port ${port}`))
  pxMain()
})

module.exports = app;

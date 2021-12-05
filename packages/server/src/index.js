const { port, env } = require('./config/vars')
const {main: pxMain}  = require('./api/web3/px')
const app = require('./config/express');
const logger = require("./config/config");
const {redisClient} = require("./config/redis")

console.log("test")

redisClient.client.on('connect', () => {
  console.log("redis connected")
  app.listen(port, () => logger.info(`server started on port ${port}`))
  pxMain()
})

module.exports = app;

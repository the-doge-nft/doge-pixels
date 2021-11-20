const { port, env } = require('./config/vars')
const ethersMain = require('./config/ethers')
const app = require('./config/express');
const logger = require("./config/config");

app.listen(port, () => logger.info(`server started on port ${port}`))
ethersMain()

module.exports = app;

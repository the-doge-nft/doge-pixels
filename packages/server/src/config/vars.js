const path = require('path');

require('dotenv-safe').config({
  path: process.env.NODE_ENV === "test" ? path.join(__dirname, '../.env.test') : path.join(__dirname, '../.env'),
  example: path.join(__dirname, '../.env.example')
});

module.exports = {
  env: process.env.NODE_ENV,
  app_env: process.env.APP_ENV,
  port: process.env.PORT,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  infura_project_id: process.env.INFURA_PROJECT_ID,
  infura_secret_id: process.env.INFURA_SECRET,
  infura_http_endpoint: process.env.INFURA_HTTP_ENDPOINT,
  infura_ws_endpoint: process.env.INFURA_WS_ENDPOINT,
  sentry_dns: process.env.SENTRY_DNS,
  contract_block_number_deployment: process.env.CONTRACT_BLOCK_NUMBER_DEPLOYMENT,
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
}


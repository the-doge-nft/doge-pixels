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
  twitter_consumer_key: process.env.TWITTER_CONSUMER_KEY,
  twitter_consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  twitter_access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  twitter_access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  nomics_api_key: process.env.NOMICS_API_KEY,
  discord_token: process.env.DISCORD_SECRET,
  discord_channel_id: process.env.DISCORD_CHANNEL_ID,
  isProd: process.env.APP_ENV === "production"
}


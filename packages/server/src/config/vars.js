const path = require('path');

require('dotenv-safe').config({
  path: process.env.NODE_ENV === "test" ? path.join(__dirname, '../.env.test') : path.join(__dirname, '../.env'),
  example: path.join(__dirname, '../.env.example')
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  infura_project_id: process.env.INFURA_PROJECT_ID,
  infura_secret_id: process.env.INFURA_SECRET,
  infura_http_endpoint: process.env.INFURA_HTTP_ENDPOINT,
  infura_ws_endpoint: process.env.INFURA_WS_ENDPOINT
}


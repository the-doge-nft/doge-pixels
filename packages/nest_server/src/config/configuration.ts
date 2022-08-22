export enum AppEnv {
  development = 'development',
  production = 'production',
  test = 'test'
}

export interface Configuration {
  port: number;
  appEnv: AppEnv;
  infura: {
    projectId: string;
    secret: string;
    httpEndpoint: string;
    wsEndpoint: string
  },
  sentryDns: string;
  pixelContractDeploymentBlockNumber: number;
  twitter: {
    consumerKey: string,
    consumerSecret: string,
    accessToken: string,
    secret: string,
  },
  discord: {
    secret: string,
    channelId: string,
  }
}

const configuration: Configuration = {
  port: parseInt(process.env.PORT) || 3000,
  appEnv: process.env.APP_ENV as AppEnv || AppEnv.development,
  infura: {
    projectId: process.env.INFURA_PROJECT_ID,
    secret: process.env.INFURA_SECRET,
    httpEndpoint: process.env.INFURA_HTTP_ENDPOINT,
    wsEndpoint: process.env.INFURA_WS_ENDPOINT,
  },
  sentryDns: process.env.SENTRY_DNS,
  pixelContractDeploymentBlockNumber:
      parseInt(process.env.CONTRACT_BLOCK_NUMBER_DEPLOYMENT) || 0,
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  },
  discord: {
    secret: process.env.DISCORD_SECRET,
    channelId: process.env.DISCORD_CHANNEL_ID,
  },
}

export default configuration

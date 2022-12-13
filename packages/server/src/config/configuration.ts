export enum AppEnv {
  development = 'development',
  production = 'production',
  staging = 'staging',
  test = 'test',
}

export interface Configuration {
  port: number;
  appEnv: AppEnv;
  isProd: boolean;
  isStaging: boolean;
  isDev: boolean;
  infura: {
    projectId: string;
    secret: string;
    httpEndpoint: string;
    wsEndpoint: string;
  };
  sentryDns: string;
  pixelContractDeploymentBlockNumber: number;
  twitter: {
    consumerKey: string;
    consumerSecret: string;
    accessToken: string;
    secret: string;
  };
  discord: {
    secret: string;
    channelId: string;
  };
  aws: {
    accessKey: string;
    accessKeySecret: string;
    region: string;
    bucketName: string;
  };
  redis: {
    host: string;
    port: number;
    password: string;
  };
  nomicsKey: string;
  alchemyKey: string;
  chainAnalysisKey: string;
}

const configuration: Configuration = {
  port: parseInt(process.env.PORT) || 3000,
  appEnv: (process.env.APP_ENV as AppEnv) || AppEnv.development,
  isProd: (process.env.APP_ENV as AppEnv) === AppEnv.production,
  isStaging: (process.env.APP_ENV as AppEnv) === AppEnv.staging,
  isDev: (process.env.APP_ENV as AppEnv) === AppEnv.development,
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
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    accessKeySecret: process.env.AWS_ACCESS_KEY_SECRET,
    region: process.env.AWS_REGION,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
  nomicsKey: process.env.NOMICS_API_KEY,
  alchemyKey: process.env.ALCHEMY_KEY,
  chainAnalysisKey: process.env.CHAINANLYSIS_KEY,
};

export default configuration;

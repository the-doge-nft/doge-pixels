"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppEnv = void 0;
var AppEnv;
(function (AppEnv) {
    AppEnv["development"] = "development";
    AppEnv["production"] = "production";
    AppEnv["test"] = "test";
})(AppEnv = exports.AppEnv || (exports.AppEnv = {}));
const configuration = {
    port: parseInt(process.env.PORT) || 3000,
    appEnv: process.env.APP_ENV || AppEnv.development,
    infura: {
        projectId: process.env.INFURA_PROJECT_ID,
        secret: process.env.INFURA_SECRET,
        httpEndpoint: process.env.INFURA_HTTP_ENDPOINT,
        wsEndpoint: process.env.INFURA_WS_ENDPOINT,
    },
    sentryDns: process.env.SENTRY_DNS,
    pixelContractDeploymentBlockNumber: parseInt(process.env.CONTRACT_BLOCK_NUMBER_DEPLOYMENT) || 0,
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
};
exports.default = configuration;
//# sourceMappingURL=configuration.js.map
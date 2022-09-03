export declare enum AppEnv {
    development = "development",
    production = "production",
    test = "test"
}
export interface Configuration {
    port: number;
    appEnv: AppEnv;
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
}
declare const configuration: Configuration;
export default configuration;

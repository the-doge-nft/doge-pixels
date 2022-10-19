import { isDevModeEnabled, isProduction, isStaging } from "./helpers";
import productionEnv from "./production";
import developmentEnv from "./development";

interface Environment {
  api: {
    baseURL: string;
    proxyURL?: string | null;
  };
  app: {
    availableTokens: {
      [key: string]: {
        decimals: number;
        contractAddress: string;
      };
    };
    targetChainId: number;
    targetNetworkName: string;
  };
}

let env: Environment;
if (isProduction()) {
  env = productionEnv;
} else if (isDevModeEnabled() || isStaging()) {
  env = developmentEnv;
} else {
  throw new Error("Unknown environment");
}

// don't allow proxy on any builds
if (!isDevModeEnabled()) {
  env.api.proxyURL = null;
}

export { env as default };

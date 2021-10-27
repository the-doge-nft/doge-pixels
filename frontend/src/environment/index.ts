import {isDevModeEnabled, isProduction} from "./helpers";
import productionEnv from "./production";
import developmentEnv from "./development";

let env: typeof productionEnv | any;
if (isProduction()) {
    env = productionEnv
} else {
    env = developmentEnv
}

// don't allow proxy on any builds
if (!isDevModeEnabled()) {
    env.api.proxyURL = null
}

export {env as default};

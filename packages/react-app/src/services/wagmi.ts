import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import env from "../environment";
import { isProduction } from "../environment/helpers";

export const targetChain = isProduction() ? chain.mainnet : chain.goerli;
export const { chains, provider } = configureChains([targetChain], [infuraProvider({ apiKey: env.app.infuraKey })]);
const { connectors } = getDefaultWallets({
  appName: "Doge Pixel Portal",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default wagmiClient;

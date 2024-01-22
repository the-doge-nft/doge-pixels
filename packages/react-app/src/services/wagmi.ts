import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, goerli, mainnet } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import env from "../environment";
import { isProduction } from "../environment/helpers";

export const targetChain = isProduction() ? mainnet : goerli;
export const { chains, provider } = configureChains([targetChain], [infuraProvider({ apiKey: env.app.infuraKey })]);
const { connectors } = getDefaultWallets({
  appName: "Doge Pixel Portal",
  chains,
  projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default wagmiClient;

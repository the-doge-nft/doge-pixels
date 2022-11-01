// import Web3Modal from "web3modal";
// import WalletConnectProvider from "@walletconnect/web3-provider";
// import { INFURA_ID } from "../constants";
// import WalletLink from "walletlink";
// import "./web3Modal.css";

// const walletLink = new WalletLink({
//   appName: "coinbase",
// });

// const walletLinkProvider = walletLink.makeWeb3Provider(`https://mainnet.infura.io/v3/${INFURA_ID}`, 1);

// const providerOptions = {
//   walletconnect: {
//     package: WalletConnectProvider, // required
//     options: {
//       bridge: "https://polygon.bridge.walletconnect.org",
//       infuraId: INFURA_ID,
//       rpc: {
//         1: `https://mainnet.infura.io/v3/${INFURA_ID}`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
//         42: `https://kovan.infura.io/v3/${INFURA_ID}`,
//         100: "https://dai.poa.network", // xDai
//       },
//     },
//   },
//   "custom-walletlink": {
//     display: {
//       logo: "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0",
//       name: "Coinbase",
//       description: "Connect to Coinbase Wallet (not Coinbase App)",
//     },
//     package: walletLinkProvider,
//     connector: async (provider: any, _options: any) => {
//       await provider.enable();
//       return provider;
//     },
//   },
// };

// export const web3ModalLightTheme = {
//   background: "var(--chakra-colors-yellow-50)",
//   main: "var(--chakra-colors-black)",
//   secondary: "var(--chakra-colors-black)",
//   border: "var(--chakra-colors-black)",
//   hover: "var(--chakra-colors-yellow-700)",
// };

// export const web3ModalDarkTheme = {
//   background: "var(--chakra-colors-purple-700)",
//   main: "var(--chakra-colors-white)",
//   secondary: "var(--chakra-colors-white)",
//   border: "var(--chakra-colors-white)",
//   hover: "var(--chakra-colors-magenta-50)",
// };

// export const web3Modal = new Web3Modal({
//   network: "mainnet", // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
//   cacheProvider: true, // optional
//   theme: "light", // optional. Change to "dark" for a dark theme.
//   providerOptions,
// });

const test = {};
export default test;

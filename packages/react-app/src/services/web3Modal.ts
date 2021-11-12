import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {INFURA_ID} from "../constants";
import Portis from "@portis/web3";
import Fortmatic from "fortmatic";
import Authereum from "authereum";
import WalletLink from "walletlink";

const walletLink = new WalletLink({
    appName: "coinbase",
});

const walletLinkProvider = walletLink.makeWeb3Provider(`https://mainnet.infura.io/v3/${INFURA_ID}`, 1);

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            bridge: "https://polygon.bridge.walletconnect.org",
            infuraId: INFURA_ID,
            rpc: {
                1: `https://mainnet.infura.io/v3/${INFURA_ID}`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
                42: `https://kovan.infura.io/v3/${INFURA_ID}`,
                100: "https://dai.poa.network", // xDai
            },
        },
    },
    "custom-walletlink": {
        display: {
            logo: "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0",
            name: "Coinbase",
            description: "Connect to Coinbase Wallet (not Coinbase App)",
        },
        package: walletLinkProvider,
        connector: async (provider: any, _options: any) => {
            await provider.enable();
            return provider;
        },
    },
    authereum: {
        package: Authereum, // required
    },
}

export const web3Modal = new Web3Modal({
    network: "mainnet", // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
    cacheProvider: true, // optional
    theme: "light", // optional. Change to "dark" for a dark theme.
    providerOptions
});
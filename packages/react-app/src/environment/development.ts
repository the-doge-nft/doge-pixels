const developmentEnv = {
    api: {
        baseURL: "https://pixels.gainormather.xyz",
        // baseURL: "https://dev.gainormather.xyz",
        // proxyURL: "http://localhost:3003"
    },
    app: {
        availableTokens: {
            USDC: {decimals: 6, contractAddress: "0xeb8f08a975Ab53E34D8a0330E0D34de942C95926"},
            USDT: {decimals: 6, contractAddress: "0x3B00Ef435fA4FcFF5C209a37d1f3dcff37c705aD"},
            WETH: {decimals: 18, contractAddress: "0xc778417E063141139Fce010982780140Aa0cD5Ab"},
        }
    }
};
export default developmentEnv;

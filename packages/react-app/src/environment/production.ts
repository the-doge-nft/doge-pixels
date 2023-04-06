const productionEnv = {
  api: {
    baseURL: "https://api.ownthedoge.com",
  },
  app: {
    availableTokens: {
      DOG: { decimals: 18, contractAddress: "0xBAac2B4491727D78D2b78815144570b9f2Fe8899" },
      USDC: { decimals: 6, contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
      USDT: { decimals: 6, contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
      WETH: { decimals: 18, contractAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
      WBTC: { decimals: 8, contractAddress: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" },
      NFD: { decimals: 18, contractAddress: "0xDFDb7f72c1F195C5951a234e8DB9806EB0635346" },
    },
    targetChainId: 1,
    targetNetworkName: "mainnet",
    infuraKey: process.env.REACT_APP_INFURA_ID,
  },
};
export default productionEnv;

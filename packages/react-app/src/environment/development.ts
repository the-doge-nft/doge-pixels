import deployedContracts from "../contracts/hardhat_contracts.json";
const developmentEnv = {
  api: {
    baseURL: "https://staging.api.ownthedoge.com",
    // proxyURL: "http://localhost:3003",
  },
  app: {
    availableTokens: {
      DOG: {
        decimals: 18,
        contractAddress: deployedContracts["5"]["goerli"]["contracts"]["DOG20"] as unknown as string,
      },
    },
    targetChainId: 5,
    targetNetworkName: "goerli",
    infuraKey: "s",
  },
};
export default developmentEnv;

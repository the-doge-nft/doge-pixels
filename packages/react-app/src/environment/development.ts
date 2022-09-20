import deployedContracts from "../contracts/hardhat_contracts.json";
const developmentEnv = {
  api: {
    baseURL: "https://staging.api.ownthedoge.com",
    // proxyURL: "http://localhost:3003",
  },
  app: {
    availableTokens: {
      DOG: { decimals: 18, contractAddress: deployedContracts["4"]["rinkeby"]["contracts"]["DOG20"] },
    },
  },
};
export default developmentEnv;

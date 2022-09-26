import deployedContracts from "../contracts/hardhat_contracts.json";
const developmentEnv = {
  api: {
    // baseURL: "https://staging.ownthedoge.com",
    baseURL: "http://localhost:3003",

    // proxyURL: "http://localhost:3003",
  },
  app: {
    availableTokens: {
      DOG: { decimals: 18, contractAddress: deployedContracts["4"]["rinkeby"]["contracts"]["DOG20"] },
    },
  },
};
export default developmentEnv;

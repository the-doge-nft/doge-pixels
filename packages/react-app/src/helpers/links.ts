import { isDevModeEnabled, isStaging } from "../environment/helpers";

export const getEtherscanURL = (address: string, type: "tx" | "address") => {
  let link = `https://etherscan.io/${type}/${address}`;
  if (isDevModeEnabled() || isStaging()) {
    link = `https://goerli.etherscan.io/${type}/${address}`;
  }
  return link;
};

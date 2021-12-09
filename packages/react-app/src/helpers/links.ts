import {isDevModeEnabled} from "../environment/helpers";
import AppStore from "../store/App.store";

export const getEtherscanURL = (address: string, type: "tx" | "address") => {
  let link = `https://etherscan.io/${type}/${address}`
  if (isDevModeEnabled()) {
    link = `https://rinkeby.etherscan.io/${type}/${address}`
  }
  return link
}

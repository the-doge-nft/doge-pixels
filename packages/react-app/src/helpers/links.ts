import {isDevModeEnabled} from "../environment/helpers";
import AppStore from "../store/App.store";

export const getEtherscanURL = (address: string) => {
  let link = `https://etherscan.io/address/${address}`
  if (isDevModeEnabled()) {
    link = `https://rinkeby.etherscan.io/address/${address}`
  }
  return link
}

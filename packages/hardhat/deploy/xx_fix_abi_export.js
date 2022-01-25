// deploy/00_deploy_your_contract.js

const {ethers, upgrades} = require("hardhat");
const prompts = require('prompts');
const fs = require("fs");
const path = require("path");
const {shouldShowTransactionTypeForHardfork} = require("hardhat/internal/hardhat-network/provider/output");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async (args) => {
  const {getNamedAccounts, deployments, getChainId, ContractFactory, network} = args
  let DOG20Address;
  const chainId = await getChainId();

  console.log("writing the hardhat_contracqts.json");

  const hardhatContractsPath = process.env.DOG_ABI_EXPORT_PATH;
  const hardhatContracts = JSON.parse(fs.readFileSync(hardhatContractsPath, 'utf8'));
  console.log("before" + JSON.stringify(hardhatContracts, null, 2));
// hardhatContracts[chainId + ""][network.name]["contracts"]["PX"] = {
//   "address": PXProxy.address,
//   "abi": JSON.parse(JSON.stringify(PXProxy.interface.fragments, null, 2))
// }
  const pxProxyAddress = fs.readFileSync(
    path.join(__dirname, '..', '.openzeppelin', 'px_proxy_address_' + chainId),
    "utf8"
  );

  hardhatContracts[chainId + ""][network.name]["contracts"]["PX"] = {
    "address": pxProxyAddress,
    "abi": JSON.parse(fs.readFileSync(
      path.join(__dirname, '..', 'artifacts', 'contracts', 'token', 'PX', 'PX.sol', 'PX.json'),
      "utf8"
    ))["abi"]
  }
  console.log("after" + JSON.stringify(hardhatContracts, null, 2));

  fs.writeFileSync(hardhatContractsPath, JSON.stringify(hardhatContracts, null, 2));
  console.log(`FINISHED ALL: ${hardhatContractsPath}`);
};
module.exports.tags = ["_PX_FIX_ABI"];

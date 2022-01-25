// deploy/01_upgrade_token_uri.js

const {ethers, upgrades} = require("hardhat");
const prompts = require('prompts');
const fs = require("fs");
const path = require("path");
// const upgrades = require('@openzeppelin/upgrades-core');
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async (args) => {
  const {getNamedAccounts, deployments, getChainId, ContractFactory} = args
  let DOG20Address;

  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();
  const chainId = await getChainId();


  const pxProxyAddress = fs.readFileSync(
    path.join(__dirname, '..', '.openzeppelin', 'px_proxy_address_' + chainId),
    "utf8"
  );
  // const deployedAddress = "0x58a6C4724157216Fb9933345B7A3575b009fcB70";
  // https://github.com/OpenZeppelin/openzeppelin-upgrades/issues/313
  let currentImplAddress = await upgrades.erc1967.getImplementationAddress(pxProxyAddress);
  console.log("PROXY ADDR: " + pxProxyAddress);
  console.log("IMPL ADDR: " + currentImplAddress);
  // const PX = await ethers.getContractAt("PX", "0x3a851Ea6f854813A52eeE4b9924f9536861a0558");
  // console.log('Upgrading PX...');
  const PXV3 = await ethers.getContractFactory('PXMock_V3');
  const res = await upgrades.upgradeProxy(pxProxyAddress, PXV3);
  console.log("after upgradeProxy()");
  console.log(res);
  currentImplAddress = await upgrades.erc1967.getImplementationAddress(pxProxyAddress);
  console.log("IMPL ADDR: " + currentImplAddress);
  console.log("FINISHED ALL");

};

// PROXY ADDR: 0x0e473d6cb4b848b09c0869b0f67a5c3ae2a1f20e
// PX.SOL ORIG: 0x999AE4B770E0A3D4855dE27D8A14417B67dCF8C6
// PX_V3.SOL: 0x2E0DDeC3d85E0eC072EC6E6bE7380e6005BAC5F6
//
// 0x999AE4B770E0A3D4855dE27D8A14417B67dCF8C6
module.exports.tags = ["PXV3"];

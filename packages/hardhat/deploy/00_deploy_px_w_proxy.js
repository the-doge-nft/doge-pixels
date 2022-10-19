// deploy/00_deploy_your_contract.js

const {ethers, upgrades, tenderly} = require("hardhat");

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
  if (args.network.name !== 'localhost' && args.network.name !== 'hardhat') {
    // const response = await prompts({
    //                                  type: 'confirm',
    //                                  name: 'value',
    //                                  message: 'Are you sure?',
    //                                  initial: false
    //                                });
    // if (!response.value) {
    //   console.log("aborting");
    //   process.exit(42069);
    // }
  }
  if (!process.env.DOG_IPFS_DEPLOY_BASE_URI) {
    console.error("[ERROR] Invalid usage, must set DOG_IPFS_DEPLOY_BASE_URI");
    process.exit(42070);
  }
  if (!process.env.DOG_IMG_WIDTH) {
    console.error("[ERROR] Invalid usage, must set DOG_IMG_WIDTH");
    process.exit(42070);
  }
  if (!process.env.DOG_IMG_HEIGHT) {
    console.error("[ERROR] Invalid usage, must set DOG_IMG_HEIGHT");
    process.exit(42070);
  }
  if (!process.env.DOG_FEES_ADDRESS_DEV) {
    console.error("[ERROR] Invalid usage, must set DOG_FEES_ADDRESS_DEV");
    process.exit(42070);
  }
  if (!process.env.DOG_FEES_ADDRESS_PLEASR) {
    console.error("[ERROR] Invalid usage, must set DOG_FEES_ADDRESS_PLEASR");
    process.exit(42070);
  }
  if (process.env.DOG20_ADDRESS) {
    console.info(`[INFO] Got DOG20_ADDRESS, using ${process.env.DOG20_ADDRESS} as DOG ERC20 contract address`);
    DOG20Address = process.env.DOG20_ADDRESS;
  }
  console.log(`============= config =============`)
  console.log(`DOG_IPFS_DEPLOY_BASE_URI=${process.env.DOG_IPFS_DEPLOY_BASE_URI}`)
  console.log(`DOG_IMG_WIDTH=${process.env.DOG_IMG_WIDTH}`)
  console.log(`DOG_IMG_HEIGHT=${process.env.DOG_IMG_HEIGHT}`)
  console.log(`==================================`)
  console.log(process.env);
  console.log(`==================================`)

  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();
  let deployed;
  // const chainId = await getChainId();
  if (!DOG20Address) {
    deployed = await deploy("DOG20", {
      from: deployer,
      // args: [[deployer,]],
      log: true,
    });
    DOG20Address = deployed.address
    const DOG20 = await ethers.getContractAt("DOG20", deployed.address);
  }
  // deployed = await deploy("PX", {
  //   from: deployer,
  //   // args: [
  //   //   "LONG LIVE D O G", "PX", DOG20.address
  //   // ],
  //   log: true,
  // });
  const initArgs = [
    "Pixels of The Doge NFT",
    "DOGEPIXEL",
    DOG20Address,
    process.env.DOG_IPFS_DEPLOY_BASE_URI,
    parseInt(process.env.DOG_IMG_WIDTH),
    parseInt(process.env.DOG_IMG_HEIGHT),
    process.env.DOG_FEES_ADDRESS_DEV,
    process.env.DOG_FEES_ADDRESS_PLEASR
  ];
  if (0) {
    const proxyAdmin = await ethers.getNamedSigner("proxyAdmin");
    const proxyPublisher = await ethers.getNamedSigner("proxyPublisher");

    await deploy("PX", {
      // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
      from: proxyAdmin.address,
      proxy: {
        //owner: accountHashtagAdmin,
        proxyContract: "OptimizedTransparentUpgradeableProxy",
        viaAdminContract: "DefaultProxyAdmin",
        execute: {
          init: {
            //make sure constructor is called on logic contract
            methodName: "initialize", // Function to call when deployed first time.
          },
          onUpgrade: {
            methodName: "postUpgrade", // method to be executed when the proxy is upgraded (not first deployment)
            args: ["hello"],
          },
        },
      },
      log: true,
    });
    return;
  }
  console.log("Deploying PX Proxy");
  const PXFactory = await ethers.getContractFactory("PX");
  console.log("Got the PX Factory");
  const PXProxy = await upgrades.deployProxy(PXFactory);
  console.log("Got the deployProxy instance");
  await PXProxy.deployed();
  console.log("PX Proxy deployed to:", PXProxy.address);
  // console.log(JSON.stringify(PXProxy.interface.fragments, null, 2));
  // process.exit(0);
  console.log("https://rinkeby.etherscan.io/address/" + PXProxy.address);
  // https://github.com/OpenZeppelin/openzeppelin-upgrades/issues/313
  await sleep(500);
  const currentImplAddress = await upgrades.erc1967.getImplementationAddress(PXProxy.address);
  const PXLogic = await ethers.getContractAt("PX", currentImplAddress);
  await sleep(1500)

  console.log("Calling __PX_init on " + PXLogic.address + ", with: ");
  console.log(initArgs);
  let res = await PXProxy.__PX_init.apply(PXProxy, initArgs);
  console.log(res);
  await sleep(1500)
  // console.log("Calling 2nd time __PX_init, should fail");
  // res = await PXLogic.__PX_init.apply(PXLogic, initArgs);
  // console.log(res);
  await sleep(10000)
  console.log("====== ====== ====== ====== ====== ======");
  console.log("======      verify deployment      ======");
  console.log("====== ====== ====== ====== ====== ======");
  console.log("BASE_URI:" + await PXProxy.BASE_URI());
  console.log("puppersRemaining:" + await PXProxy.puppersRemaining());
  console.log("PROXY ADDR: " + PXProxy.address);
  console.log("IMPL ADDR: " + PXLogic.address);
  console.log("https://goerli.etherscan.io/address/" + PXProxy.address);
  console.log("https://goerli.etherscan.io/address/" + PXLogic.address);
  fs.writeFileSync(path.join(__dirname, '..', '.openzeppelin', 'px_proxy_address_' + chainId), PXProxy.address);
  fs.writeFileSync(
    path.join(__dirname, '..', '.openzeppelin', 'px_proxy_abi_' + chainId),
    JSON.stringify(PXProxy.interface.fragments, null, 2)
  );
  fs.writeFileSync(path.join(__dirname, '..', '.openzeppelin', 'px_logic_address_' + chainId), PXLogic.address);
  fs.writeFileSync(
    path.join(__dirname, '..', '.openzeppelin', 'px_logic_abi_' + chainId),
    JSON.stringify(PXLogic.interface.fragments, null, 2)
  );
  console.log(`FINISHED ALL`);

  // await tenderly.persistArtifacts({
  //                                       name: "PXPROXY",
  //                                       address: PXProxy.address
  //                                     });
  //
  // const tRes = await tenderly.persistArtifacts({
  //                                       name: "PXLogic",
  //                                       address: PXLogic.address
  //                                     });
  // console.log(`FINISHED ALL: TENDERLY`);
  // console.log(tRes);
};
module.exports.tags = ["PXWPROXY"];

// deploy/00_deploy_your_contract.js

const {ethers} = require("hardhat");
const prompts = require('prompts');
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async (args) => {
  const {getNamedAccounts, deployments, getChainId, ContractFactory} = args
  let DOG20Address;

  // console.log(args.network);
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
  deployed = await deploy("PX", {
    from: deployer,
    // args: [
    //   "LONG LIVE D O G", "PX", DOG20.address
    // ],
    log: true,
  });
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
  console.log("DEPLOYED");
  console.log("INITIALIZING WITH PARAMS: ");
  console.log(initArgs);
  // sometimes __PX_init fails silently, to make our chances higher
  await sleep(500);
  const PX = await ethers.getContractAt("PX", deployed.address);
  const res = await PX.__PX_init.apply(PX, initArgs);
  console.log("__PX__init result:");
  console.log(res);
  console.log("INITIALIZED");
  console.log("FINISHED ALL");
};
module.exports.tags = ["PX_NO_PROXY"];

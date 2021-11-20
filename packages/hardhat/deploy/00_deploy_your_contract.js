// deploy/00_deploy_your_contract.js

const {ethers} = require("hardhat");
const prompts = require('prompts');
module.exports = async (args) => {
  const {getNamedAccounts, deployments, getChainId, ContractFactory} = args

  // console.log(args.network);
  if (args.network.name !== 'localhost' && args.network.name !== 'hardhat') {
    const response = await prompts({
                                     type: 'confirm',
                                     name: 'value',
                                     message: 'Are you sure?',
                                     initial: false
                                   });
    if (!response.value) {
      console.log("aborting");
      process.exit(42069);
    }
  }
  if(!process.env.DOG_IPFS_DEPLOY_BASE_URI){
    console.error("[ERROR] Invalid usage, must set DOG_IPFS_DEPLOY_BASE_URI");
    process.exit(42070);
  }
  console.log(`============= config =============`)
  console.log(`DOG_IPFS_DEPLOY_BASE_URI=${process.env.DOG_IPFS_DEPLOY_BASE_URI}`)
  console.log(`==================================`)

  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();
  // const chainId = await getChainId();

  let deployed = await deploy("DOG20", {
    from: deployer,
    // args: [[deployer,]],
    log: true,
  });
  const DOG20Address = deployed.address
  const DOG20 = await ethers.getContractAt("DOG20", deployed.address);
  deployed = await deploy("PX", {
    from: deployer,
    // args: [
    //   "LONG LIVE D O G", "PX", DOG20.address
    // ],
    log: true,
  });
  const PX = await ethers.getContractAt("PX", deployed.address);
  await PX.__PX_init(
    "LONG LIVE D O G",
    "PX",
    DOG20Address,
    process.env.DOG_IPFS_DEPLOY_BASE_URI
  )
  // const initMock = await DOG20.initMock([])
  // console.log(initMock)
};
module.exports.tags = ["PX"];

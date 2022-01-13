#!/bin/bash
#
# deploy-hardhat-no-ipfs.sh
#
# Description:
# Deploy to local hardhat. Skips IPFS handling. Mocks img width and height
#
set -eu
export SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
export HARDHATPATH="$SCRIPTPATH/../packages/hardhat"
export DOG_IPFS_DEPLOY_BASE_URI='http://143.198.55.229/ipns/k51qzi5uqu5di5wb62lm8ix9tev70ugcj8a8ikn3np2n33qnezaumg1phfzexi/'
export DOG_IMG_WIDTH=$(( 640 * 100 / 100 ))
export DOG_IMG_HEIGHT=$(( 480 * 100 / 100 ))
# DOG_FEES_RINKEBY_DEV // METAMASK
export DOG_FEES_ADDRESS_DEV="0x1598a4e1B57E9C1DDdEC110e45FFfE52981D117F"
# DOG_FEES_RINKEBY_PLEASR // METAMASK
export DOG_FEES_ADDRESS_PLEASR="0xc723AdEe252f813C70678bd8213b4b70501477eE"
EXPORT_PATH="$HARDHATPATH/hardhat_contracts.json"
#export DOG20_ADDRESS="0x6aFB2ba8d536223f2a78a58BdC82cB71C1a2B204"
pushd "$HARDHATPATH"
  # deployed contract cannot be reused, __init() will fail
  rm -rf ./deployments/rinkeby
  npx hardhat deploy --network rinkeby --export-all "$EXPORT_PATH"
  cp "$EXPORT_PATH" "$HARDHATPATH/../react-app/src/contracts/hardhat_contracts.json"
  cp "$EXPORT_PATH" "$HARDHATPATH/../server/src/contracts/hardhat_contracts.json"
popd

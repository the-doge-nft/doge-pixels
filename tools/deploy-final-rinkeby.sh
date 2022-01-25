#!/bin/bash
#
# deploy-hardhat-no-ipfs.sh
#
# Description:
# Deploy to local hardhat. Skips IPFS handling. Mocks img width and height
#
set -eux
export SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
export HARDHATPATH="$SCRIPTPATH/../packages/hardhat"
export CID_METADATA="QmSjRs4dH5q2wV5mqY4ujpXNQByYyvf2A8pk6sUXgCA3QQ"
export DOG_IPFS_DEPLOY_BASE_URI="https://therealdoge.mypinata.cloud/ipfs/$CID_METADATA/"
export DOG_IMG_WIDTH=$(( 640 * 100 / 100 ))
export DOG_IMG_HEIGHT=$(( 480 * 100 / 100 ))
# DOG_FEES_RINKEBY_DEV // METAMASK
export DOG_FEES_ADDRESS_DEV="0x1598a4e1B57E9C1DDdEC110e45FFfE52981D117F"
# DOG_FEES_RINKEBY_PLEASR // METAMASK
export DOG_FEES_ADDRESS_PLEASR="0xcb20a54c4ed357bf7e28d1966e3f0f5215e25b37"
export DOG_ABI_EXPORT_PATH="$HARDHATPATH/hardhat_contracts.json"
#export DOG20_ADDRESS="0x6aFB2ba8d536223f2a78a58BdC82cB71C1a2B204"
pushd "$HARDHATPATH"
  # deployed contract cannot be reused, __init() will fail
  dd=localhost
  dd=rinkeby
  # reset all previous deployment
#  if false ; then
  if false ; then
    echo "removing previous deployment
    rm -rf ./artifacts/
    rm -rf ./cache
    rm -r ./hardhat_contracts.json || true
    rm -rf ./.openzeppelin"
    rm -rf ./deployments/
  fi
#  npx hardhat deploy --network $dd --tags PXWPROXY --export-all "$DOG_ABI_EXPORT_PATH"
  npx hardhat deploy --network $dd --tags _PX_FIX_ABI --write false
#  npx hardhat deploy --network rinkeby --tags PXV3 --export-all "$DOG_ABI_EXPORT_PATH"
  cp "$DOG_ABI_EXPORT_PATH" "$HARDHATPATH/../react-app/src/contracts/hardhat_contracts.json"
  cp "$DOG_ABI_EXPORT_PATH" "$HARDHATPATH/../server/src/contracts/hardhat_contracts.json"
popd

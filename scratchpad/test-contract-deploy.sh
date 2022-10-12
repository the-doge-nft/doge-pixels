#!/bin/bash

set -eu

export SCRIPT_PATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
export ROOT_PATH="$SCRIPT_PATH/.."
export HARDHAT_PATH="$ROOT_PATH/packages/hardhat"
export ABI_EXPORT_PATH="$SCRIPT_PATH/hardhat_contracts.json"

export DOG_IMG_WIDTH=640
export DOG_IMG_HEIGHT=480
export DOG_FEES_ADDRESS_DEV="0xd801d86C10e2185a8FCBccFB7D7baF0A6C5B6BD5"
export DOG_FEES_ADDRESS_PLEASR="0xd801d86C10e2185a8FCBccFB7D7baF0A6C5B6BD5"
export CID="QmSjRs4dH5q2wV5mqY4ujpXNQByYyvf2A8pk6sUXgCA3QQ"
export DOG_IPFS_DEPLOY_BASE_URI="https://therealdoge.mypinata.cloud/ipfs/$CID/"
export DEPLOY_ID=$(date '+%Y-%m-%d_%H_%M_%S')
export DOG_IPFS_KEY="dog_deploy_$DEPLOY_ID"

NETWORK="goerli"

pushd $HARDHAT_PATH
  echo "deploying to $NETWORK"
  npx hardhat --network $NETWORK deploy --tags PXWPROXY --export-all "$ABI_EXPORT_PATH"
popd


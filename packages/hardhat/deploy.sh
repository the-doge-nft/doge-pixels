#!/bin/bash
#
# deploy.sh
#
# Description:
# Deploy to local hardhat. Skips IPFS handling. Mocks img width and height
#
set -eu
export SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
export DOG_IPFS_DEPLOY_BASE_URI=ipfs://local-dog/
export DOG_IMG_WIDTH=$(( 640 * 2 / 100 ))
export DOG_IMG_HEIGHT=$(( 480 * 2 / 100 ))
EXPORT_PATH="$SCRIPTPATH/hardhat_contracts.json"
pushd "$SCRIPTPATH"
  # deployed contract cannot be reused, __init() will fail
  rm -rf ./deployments/localhost
  npx hardhat deploy --network localhost --export-all "$EXPORT_PATH"
  cp "$EXPORT_PATH" "$SCRIPTPATH/../react-app/src/contracts/hardhat_contracts.json"
  cp "$EXPORT_PATH" "$SCRIPTPATH/../server/src/contracts/hardhat_contracts.json"
popd

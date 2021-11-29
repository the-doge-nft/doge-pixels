#!/bin/bash

set -eu
export SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
export HARDHATDIR="$SCRIPTPATH/../../hardhat"
export EXPORT_PATH="$SCRIPTPATH"
export DOG_IPFS_DEPLOY_BASE_URI=ipfs://local-dog/
export DOG_IMG_WIDTH=$(( 640 * 2 / 100 ))
export DOG_IMG_HEIGHT=$(( 480 * 2 / 100 ))
cd $HARDHATDIR
yarn hardhat node --network hardhat --no-deploy &
yarn hardhat deploy --network localhost --export-all "$EXPORT_PATH/contracts/hardhat_contracts.json"



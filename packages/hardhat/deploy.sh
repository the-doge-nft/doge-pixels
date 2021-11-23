#!/bin/bash
#
# deploy.sh
#
# Description:
# Deploy to local hardhat. Skips IPFS handling. Mocks img width and height
#
set -eu
export DOG_IPFS_DEPLOY_BASE_URI=ipfs://local-dog/
export DOG_IMG_WIDTH=$(( 640 * 2 / 100 ))
export DOG_IMG_HEIGHT=$(( 480 * 2 / 100 ))
npx hardhat deploy --network localhost --export-all ../react-app/src/contracts/hardhat_contracts.json
cp ../react-app/src/contracts/hardhat_contracts.json ../server/src/contracts/hardhat_contracts.json

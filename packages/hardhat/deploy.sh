#!/bin/bash
set -eux
#echo "yarn deploy not supported"
#echo "Please use ./tools/deploy-hardhat.sh for local deployment"
#exit 420
export DOG_IPFS_DEPLOY_BASE_URI=ipfs://local-dog/
export DOG_IMG_WIDTH=$(( 640*2/100 ))
export DOG_IMG_HEIGHT=$(( 480*2/100 ))
npx hardhat deploy --network localhost --export-all ../react-app/src/contracts/hardhat_contracts.json
cp ../react-app/src/contracts/hardhat_contracts.json ../server/src/contracts/hardhat_contracts.json

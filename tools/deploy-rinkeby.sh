#!/bin/bash
set -eux
export SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
ROOTPATH="$SCRIPTPATH/.."
pushd "$SCRIPTPATH"
  # 1. generate tiles
  # 2. deploy ipfs
  # 3. insert ipfs prefix to contract
  # 4. deploy conntract to rinkeby
  pushd "$ROOTPATH/packages/hardhat"
    export DOG_IPFS_DEPLOY_BASE_URI="ipfs://dog-repo-2/"
    npx hardhat deploy --network hardhat --export-all ./test-deploy.json
#    npx hardhat deploy --network rinkeby --export-all ./test-deploy2.json #../react-app/src/contracts/hardhat_contracts.json
  popd
popd

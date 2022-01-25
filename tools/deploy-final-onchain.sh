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
export DOG_ABI_EXPORT_PATH="$HARDHATPATH/hardhat_contracts.json"

# set to "yes" to remove abi/cache/artifacts
RESET_ARTIFACTS=yes

NETWORK="$1"
dd=$(echo $NETWORK | tr "[:upper:]" "[:lower:]")


if [ "$NETWORK" = "MAINNET" ]; then
  export DOG20_ADDRESS="0xBAac2B4491727D78D2b78815144570b9f2Fe8899"
  export DOG_FEES_ADDRESS_DEV="0xAF838Fe6196A08f4575dB0FA7f1904137112ab3f"
  export DOG_FEES_ADDRESS_PLEASR="0xcb20a54c4ed357bf7e28d1966e3f0f5215e25b37"
elif [ "$NETWORK" = "RINKEBY" ]; then
  export DOG20_ADDRESS=
  export DOG_FEES_ADDRESS_DEV="0x1598a4e1B57E9C1DDdEC110e45FFfE52981D117F"
  export DOG_FEES_ADDRESS_PLEASR="0xcb20a54c4ed357bf7e28d1966e3f0f5215e25b37"
else
  echo "Unknown network $NETWORK, abort..."
  exit 420
fi

pushd "$HARDHATPATH"
  if [ "$RESET_ARTIFACTS" = "yes" ]; then
    echo "removing previous deployment"
    rm -rf ./artifacts/
    rm -rf ./cache
    rm -r ./hardhat_contracts.json || true
    rm -rf ./.openzeppelin
    rm -rf ./deployments/
  fi
#  exit 1

  echo "Deploying $dd"
  echo "Deploying $dd"
  npx hardhat deploy --network $dd --tags PXWPROXY --export-all "$DOG_ABI_EXPORT_PATH"
  #  npx hardhat deploy --network $dd --tags _PX_FIX_ABI --write false
  #  npx hardhat deploy --network rinkeby --tags PXV3 --export-all "$DOG_ABI_EXPORT_PATH"
  npx hardhat deploy --network $dd --tags _PX_FIX_ABI --write false

  cp "$DOG_ABI_EXPORT_PATH" "$HARDHATPATH/../react-app/src/contracts/hardhat_contracts.json"
  cp "$DOG_ABI_EXPORT_PATH" "$HARDHATPATH/../server/src/contracts/hardhat_contracts.json"
popd

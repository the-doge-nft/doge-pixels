#!/bin/bash

function echoWithPadding() {
  echo ""
  echo "$1"
  echo ""
}

export SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
export HARDHATDIR="$SCRIPTPATH/../../hardhat"
export DOG_IPFS_DEPLOY_BASE_URI=ipfs://local-dog/
export DOG_IMG_WIDTH=640
export DOG_IMG_HEIGHT=480
export DOG_FEES_ADDRESS="0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f"
export HARDHATPORT=8545

cd $HARDHATDIR
echoWithPadding "1️⃣  spinning up hardhat local node 👷"
yarn hardhat node --network hardhat --no-deploy &

sleep 5

echoWithPadding "2️⃣  deploying contracts 🚀"
npx hardhat deploy --network localhost --export-all "$SCRIPTPATH/contracts/hardhat_contracts.json"

echoWithPadding "3️⃣  starting redis container"
docker-compose -f "$SCRIPTPATH/../docker-compose.yml" up -d

echoWithPadding "4️⃣  running tests"
cd $SCRIPTPATH
NODE_ENV=test jest --runInBand --detectOpenHandles --forceExit
TEST_STATUS=$?

echoWithPadding "5️⃣  cleaning up"
# no great way to stop hardhat node
# https://github.com/nomiclabs/hardhat/issues/1879
lsof -t -i:$HARDHATPORT | xargs kill -9
docker-compose -f "$SCRIPTPATH/../docker-compose.yml" down --remove-orphans


if test $TEST_STATUS -eq 0
then
  echoWithPadding "6️⃣  result - all tests passing ✅"
  exit 0
else
  echoWithPadding "6️⃣  result - tests failed ❌"
  exit 1
fi


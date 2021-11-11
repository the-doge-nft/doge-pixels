#!/bin/bash

set -eux
export SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
pushd "$SCRIPTPATH"
  # todo: should copy all dependencies of PX from ./hardhat/contracts to make sure none of them changed from original openzeppelin contracts
  cp -r ../hardhat/contracts/token/PX ./contracts/token
  npx hardhat test
popd

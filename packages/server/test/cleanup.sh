#!/bin/bash

set -eu
export SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

HARDHATPORT=8545
# no great way to stop hardhat node
# https://github.com/nomiclabs/hardhat/issues/1879
lsof -t -i:$HARDHATPORT | xargs kill -9

docker-compose -f "$SCRIPTPATH/../docker-compose.yml" down
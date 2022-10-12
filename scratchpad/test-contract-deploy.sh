#!/bin/bash

set -eu

export SCRIPT_PATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
export ROOT_PATH="$SCRIPT_PATH/.."


export DOG_IPFS_DEPLOY_BASE_URI=
export DOG_IMG_WIDTH=640
export DOG_IMG_HEIGHT=480
export DOG_FEES_ADDRESS_DEV=
export DOG_FEES_ADDRESS_PLEASR=
export DOG20_ADDRESS=
export CID_PIXELS="k51qzi5uqu5djqiqaht7oyvstxe24g4zk4lgt4nf92q7b4t9x3xjoqzkvmha1w"
export DEPLOY_ID=$(date '+%Y-%m-%d_%H_%M_%S')
export DOG_IPFS_KEY="dog_deploy_$DEPLOY_ID"


pushd $ROOT_PATH
  pwd
popd


#!/bin/bash
set -eux
export BUILD_ID="$1"
export DEPLOYMENT_ENV="$2"


export SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
echo 'export BUILD_ID="'$BUILD_ID'"' >~/.pixels-envs
echo 'export DOCKER_REGISTRY="calebcarithers"' >>~/.pixels-envs
echo 'export LAST_DEPLOYMENT_AT="'$(date)'"' >>~/.pixels-envs

pushd "$SCRIPTPATH"
  ./deployment-up.sh
popd


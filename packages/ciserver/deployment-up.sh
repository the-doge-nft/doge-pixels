#!/bin/bash
set -eux
export SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
pushd "$SCRIPTPATH/../server"
    source ~/.pixels-envs
    docker compose -f docker-compose-deployment.yml up -d api
popd

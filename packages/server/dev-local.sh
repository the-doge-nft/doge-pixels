#!/bin/bash

# dev-local.sh
# runs & brings down api and db docker containers
#
# Usage
#   ./dev-local.sh up
#   ./dev-local.sh down

set -eu

export SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"


spacedEcho() {
    echo ""
    echo "$1"
    echo ""
}

removePreviousBuildMaybe() {
  if [ -d "$SCRIPTPATH/dist" ]
  then
    spacedEcho "removing old dist"
    rm -r dist/
  fi
}

up() {
    removePreviousBuildMaybe

    spacedEcho "spinning up db"
    docker-compose up -d db
    sleep 5

    spacedEcho "spinning up redis"
    docker-compose up -d redis
    sleep 5

    spacedEcho "compiling contracts"
    yarn compile_contracts

    spacedEcho "migrating local db"
    yarn prisma:migratedev

    spacedEcho "spinning up api"
    if [[ $1 = "--build" ]]; then
      docker-compose up --build -d api;
    else
      docker-compose up -d api
    fi;

    spacedEcho "listening to logs"
    docker-compose logs -f
}

down() {
    echo "bringing down db, redis, & api"
    docker-compose down --remove-orphans -v
}

usage() {
    cat <<HELP_USAGE
Usage:
    dev-local.sh up:
        spins up api & db

    dev-local.sh down:
        pulls down api and db containers
HELP_USAGE
    exit 0
}

if [[ $1 == "down" ]]; then
    down
elif [[ $1 == "up" ]]; then
    up ${2-""}
else
    usage
fi

trap handler SIGINT
down


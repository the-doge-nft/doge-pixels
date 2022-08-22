#!/bin/bash

# dev-local.sh
# runs & brings down api and db docker containers
#
# Usage
#   ./dev-local.sh up
#   ./dev-local.sh down

spacedEcho() {
    echo ""
    echo "$1"
    echo ""
}

up() {
    # TODO: issues here connecting to db from api docker container
    echo "spinning up api"
    docker-compose up -d db
    sleep 5
    yarn prisma migrate dev --name init
    yarn start:dev
#    docker-compose up -d api
#    docker-compose logs
}

down() {
    echo "bringing down db & api"
    docker-compose down --remove-orphans -v
    killall node
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
    up
else
    usage
fi

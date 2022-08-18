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
    echo "spinning up redis"
    docker-compose up -d
    sleep 5

    spacedEcho "starting server"
    yarn dev
    sleep 1

    spacedEcho "streaming logs"
    yarn logs
    sleep 3
}

down() {
    echo "bringing down redis"
    docker-compose down
    spacedEcho "stopping server"
    yarn stop
}

usage() {
    cat <<HELP_USAGE
Usage:
    dev-local.sh up:
        spins up api and redis container

    dev-local.sh down:
        pulls down api and redis container
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

#!/bin/bash

# dev-local.sh
# interact with the local docker project

set -eu

export SCRIPTPATH="$(
    cd "$(dirname "$0")" >/dev/null 2>&1
    pwd -P
)"

__spacedEcho() {
    echo ""
    echo "$1"
    echo ""
}

__removePreviousBuildMaybe() {
    if [ -d "$SCRIPTPATH/dist" ]; then
        __spacedEcho "removing old dist"
        rm -r dist/
    fi
}

__spinDownApiMaybe() {
    if [ $(__getApiContainerId) ]; then
        __spacedEcho "api is up, spinning down first"
        docker-compose stop api
    fi
}

__getApiContainerId() {
    echo "$(docker ps -aqf "name=doge-pixels-api")"
}

__depsUp() {
    __spacedEcho "spinning up db"
    docker-compose up -d postgres

    __spacedEcho "spinning up redis"
    docker-compose up -d redis
}

__runInApiContainer() {
    local API_ID=$(__getApiContainerId)
    if [[ $API_ID ]]; then
        docker exec -it $API_ID "$@"
    else
        echo "api container is not running, please run ./dev-local.sh up"
        return 1
    fi
}

up() {
    __removePreviousBuildMaybe
    __spinDownApiMaybe
    __depsUp

    __spacedEcho "spinning up api"
    if [[ "${1-'no'}" == "--build" ]]; then
        __spacedEcho "building api image"
        docker-compose up --build -d api
    else
        docker-compose up -d api
    fi

    __spacedEcho "listening to logs"

    dbMigrate
    dbSeed

    docker-compose logs -f
}

down() {
    __spacedEcho "bringing down db, redis, & api"
    docker-compose down --remove-orphans -v
}

dbPush() {
    __spacedEcho "pushing db"
    __runInApiContainer yarn prisma:push
}

dbSeed() {
    __spacedEcho "seed disabled for now"
    return 0
    __spacedEcho "seeding db"
    __runInApiContainer yarn prisma:seed
}

dbGenerate() {
    __spacedEcho "generating prisma client"
    __runInApiContainer yarn prisma:generate
}

dbMigrate() {
    __spacedEcho "migrating db"
    __runInApiContainer yarn prisma:migrate
}

repl() {
    __runInApiContainer yarn start:repl
}

test() {
    __runInApiContainer yarn test
}

e2e() {
    __runInApiContainer yarn test:e2e
}

exec() {
    echo "$@"
    __runInApiContainer "$@"
}

usage() {
    cat <<HELP_USAGE
Usage:
    dev-local.sh up:
        spins up containers for local development
        
        --build: rebuilds the containers (this will be necessary if any new dependencies are added)

    dev-local.sh down:
        pulls down local development containers

    dev-local.sh dbpush:
        push changes to db without creating a prisma migration - NOTE: this should be used for prototyping in development only

    dev-local.sh dbseed:
        seed data located in prisma/seed.ts to local database

    dev-local.sh dbmigrate:
        run prisma migrations

    dev-local.sh repl:
        start a REPL for super dev powers. read more here: https://docs.nestjs.com/recipes/repl

    dev-local.sh test:
        run unit tests

    dev-local.sh e2e:
        run integration tests

    dev-local.sh exec:
        run a comand in the api docker container
HELP_USAGE
    exit 0
}

case $1 in
"down")
    down
    ;;

"up")
    if [[ "${2-""}" == "--build" ]]; then
        up "--build"
    else
        up
    fi
    ;;

"dbpush")
    dbPush
    ;;

"dbseed")
    dbSeed
    ;;

"dbgenerate")
    dbGenerate
    ;;

"dbmigrate")
    dbMigrate
    ;;

"repl")
    repl
    ;;

"test")
    test
    ;;

"e2e")
    e2e
    ;;

"exec")
    exec "${@:2}"
    ;;

"--help")
    usage
    ;;

*)
    usage
    ;;
esac

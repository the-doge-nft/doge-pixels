#!/bin/bash

usage() {
    cat <<HELP_USAGE
Usage:
    ci.sh prod:
        returns prod ci server logs

    ci.sh dev:
        returns dev ci server logs
HELP_USAGE
    exit 0
}

if [[ $1 == "dev" ]]; then
    curl http://167.172.252.56:3009/logs
elif [[ $1 == "prod" ]]; then
    curl http://143.244.147.62:3009/logs
else
    usage
fi

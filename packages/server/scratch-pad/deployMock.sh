#!/bin/bash

# scripts used to recreate production deployments

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
export DOCKER_REGISTRY=local
export APP=doge-pixels
export BUILD_ID=local_1


buildApi() {
 docker build "$SCRIPT_DIR/../." -f "$SCRIPT_DIR/../doge-pixels.Dockerfile" \
   -t $DOCKER_REGISTRY/$APP:$BUILD_ID --target production --no-cache
}

upApi() {
  docker-compose -f "$SCRIPT_DIR/../docker-compose-deployment.yml" up api
}

upDb() {
  docker-compose -f "$SCRIPT_DIR/../docker-compose-deployment.yml" up -d db
}

downDb() {
  docker-compose -f "$SCRIPT_DIR/../docker-compose-deployment.yml" down --remove-orphans -v
}

removeAllImages() {
  docker rmi -f $(docker images -a -q)
}

removeAllContainers() {
  docker rm $(docker ps -a -q)
}

removeAllVolumes() {
  docker volume rm -f $(docker volume list -q)
}

cleanDocker() {
  removeAllContainers
  removeAllImages
  removeAllVolumes
}

$1


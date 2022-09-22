
appname="doge-pixels"

imageNameFor() {
  declare appname="$1"
  echo "${DOCKER_REGISTRY}/$appname"
}

latestTagFor() {
  echo "$(imageNameFor "$1"):latest"
}

fullShaTagFor() {
  echo "$(imageNameFor "$1"):${BUILD_ID}"
}


validateEnvs() {
    if [ "$BUILD_ID" == "" ]; then
      echo "BUILD_ID must be present in env"
      exit 255
    fi
    if [ "$DOCKER_REGISTRY" == "" ]; then
      echo "DOCKER_REGISTRY must be present in env"
      exit 255
    fi
}


buildApi() {
  validateEnvs

  echo "DOCKER_REGISTRY: $DOCKER_REGISTRY"
  echo "BUILD_ID: $BUILD_ID"


  latest_tag="$(latestTagFor "$appname")"
  sha_tag="$(fullShaTagFor "$appname")"

  echo "👷‍🚧👷 building:: $appname: $sha_tag :: $latest_tag"

  docker build "./packages/server" \
  -f "./packages/server/$appname.Dockerfile" \
  -t "$latest_tag" \
  --label "runnumber=${GITHUB_RUN_ID}" \
  --target production

  docker tag "$latest_tag" "$sha_tag"
}

pushImage() {
  validateEnvs
  docker push "$DOCKER_REGISTRY/$appname:$BUILD_ID"
}

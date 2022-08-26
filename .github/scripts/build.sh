
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

  latest_tag="$(latestTagFor "$appname")"
  sha_tag="$(fullShaTagFor "$appname")"

  echo "👷‍🚧👷 building:: $appname: $sha_tag :: $latest_tag"

  docker build "./packages/nest_server" \
  -f "./packages/nest_server/$appname.Dockerfile" \
  -t "$latest_tag" \
  --label "runnumber=${GITHUB_RUN_ID}" \
  --target production

  docker tag "$latest_tag" "$sha_tag"
}

pushImage() {
  validateEnvs
  docker push "$DOCKER_REGISTRY/$appname:$BUILD_ID"
}

pushImage

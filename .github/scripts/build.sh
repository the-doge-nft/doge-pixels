
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

validateBuildId() {
    if [ "$BUILD_ID" == "" ]; then
      echo "BUILD_ID must be present in env"
      exit 255
    fi
}

buildApi() {
  validateBuildId

  latest_tag="$(latestTagFor "$appname")"
  sha_tag="$(fullShaTagFor "$appname")"

  echo "building:: $appname: $sha_tag"

  docker build "./packages/nest_server" \
  -f "./packages/nest_server/$appname.Dockerfile" \
  -t "$latest_tag" \
  --target production

  docker tag "$latest_tag" "$sha_tag"
}

pushImage() {
  validateBuildId
  docker push "$DOCKER_REGISTRY/$appname:$BUILD_ID"
}

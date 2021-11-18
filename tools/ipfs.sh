#!/bin/bash
set -eux
export SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
pushd "$SCRIPTPATH"
  # <debug>
  ipns_dir=
  dir_cid=
  full_log=
  # </debug>

  ipfs_key=dog_deploy
  ipfs key gen $ipfs_key || true
  # first run without --quieter to see full logs
  full_log=$(ipfs add -r ./ipfs-test)
  # --quieter: return only final hash
  dir_cid=$(ipfs add -r --quieter ./ipfs-test)
  echo "$dir_cid"
  ipns_dir=$(ipfs name publish --quieter --key=$ipfs_key "$dir_cid")
  echo "Files uploaded to: https://gateway.ipfs.io/ipns/$ipns_dir"
  deploy_date=$(date '+%Y-%m-%d_%H_%M_%S')
  mkdir ./logs || true
  jq -n --arg cid "$dir_cid" --arg ipns_dir "$ipns_dir" --arg full_log "$full_log" '{cid: $cid, ipns: $ipns_dir, full_log: $full_log}' > "./logs/deploy-$deploy_date.json"
popd

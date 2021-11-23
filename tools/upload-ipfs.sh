#!/bin/bash
set -eux
export SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
function isIpfsRunning(){
  pgrep -f 'ipfs daemon'
}
# clean bootstrap(in case of connection issues):
# ipfs bootstrap rm --all
pushd "$SCRIPTPATH"
  IN_PATH="$1"
  # <debug>
  ipns_dir=
  dir_cid=
  full_log=
  # </debug>
  if isIpfsRunning; then
    echo "Daemon running"
  else
    echo "Daemon not running"
    exit 1
  fi

  mkdir "./deploy-logs" || true
  RUN_LOG_PATH="./deploy-logs/$DEPLOY_ID-run.log"
  DEPLOY_LOG_PATH="./deploy-logs/$DEPLOY_ID-ipfs.json"
  # first run without --quieter to see full logs
  full_log=$(ipfs add -r $IN_PATH)
  # --quieter: return only final hash
  dir_cid=$(ipfs add -r --quieter $IN_PATH)
  echo "$dir_cid" >> "$RUN_LOG_PATH"
  ipfs name publish --key="$DOG_IPFS_KEY" "$dir_cid"
  ipns_dir=$(ipfs name publish --quieter --key="$DOG_IPFS_KEY" "$dir_cid")
  echo "Files uploaded to: https://gateway.ipfs.io/ipns/$ipns_dir" >> "$RUN_LOG_PATH"
  jq -n --arg cid "$dir_cid" --arg run_log "$RUN_LOG_PATH" --arg ipns_dir "$ipns_dir" --arg full_log "$full_log" '{cid: $cid, run_log: $run_log, ipns: $ipns_dir, full_log: $full_log}' > "$DEPLOY_LOG_PATH"
  echo "IPFS debug saved to $DEPLOY_LOG_PATH" >> "$RUN_LOG_PATH"
  echo "Success" >> "$RUN_LOG_PATH"
  echo "$DEPLOY_LOG_PATH"
popd
##!/bin/bash
#export SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
#function isIpfsRunning(){
#  pgrep -f 'ipfs daemon'
#}
#LOGPREFIX="test"
#RUN_LOG_PATH="$SCRIPTPATH/deploy-logs/$DEPLOY_ID-run.log"
#DEPLOY_LOG_PATH="$SCRIPTPATH/deploy-logs/$DEPLOY_ID-ipfs.json"
#LOGFILE="$RUN_LOG_PATH"
#{
#pushd "$SCRIPTPATH"
#  set -eux
#
#  IN_PATH="$1"
#  # <debug>
#  ipns_dir=
#  dir_cid=
#  full_log=
#  # </debug>
#  if isIpfsRunning; then
#    echo "Daemon running"
#  else
#    echo "Daemon not running"
#    exit 1
#  fi
#
#  mkdir "./deploy-logs" || true
#  # first run without --quieter to see full logs
#  full_log=$(ipfs add -r $IN_PATH)
#  # --quieter: return only final hash
#  dir_cid=$(ipfs add -r --quieter $IN_PATH)
#  echo "$dir_cid"
#  ipns_dir=$(ipfs name publish --quieter --key="$DOG_IPFS_KEY" "$dir_cid")
#  echo "Files uploaded to: https://gateway.ipfs.io/ipns/$ipns_dir"
#  jq -n --arg cid "$dir_cid" --arg run_log "$RUN_LOG_PATH" --arg ipns_dir "$ipns_dir" --arg full_log "$full_log" '{cid: $cid, run_log: $run_log, ipns: $ipns_dir, full_log: $full_log}' > "$DEPLOY_LOG_PATH"
#  echo "IPFS debug saved to $DEPLOY_LOG_PATH"
#  echo "Success"
#} > >(while read TEXT ; do MESSAGE="$(date +"%d.%m.%Y") $(date +"%Hh%Mm%Ss") $LOGPREFIX $TEXT"; echo $MESSAGE; echo $MESSAGE > /dev/tty; done >> $LOGFILE) 2>&1
##} > "$RUN_LOG_PATH" 2>"$RUN_LOG_PATH"
#  echo "$DEPLOY_LOG_PATH"
#popd
#

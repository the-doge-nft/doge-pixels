#!/bin/bash
RETURN_TRUE=0
RETURN_FALSE=255
function get_ipns_dir(){
    maybeCreateIpfsKey > /dev/null 2> /dev/null
    touch test.tmp
    ipns_dir=$(ipfs name publish --quieter --key="$DOG_IPFS_KEY" $(ipfs add --quieter ./test.tmp))
    echo $ipns_dir
    rm test.tmp
}
function maybeCreateIpfsKey(){
  ipfs key gen "$DOG_IPFS_KEY" || true
}

function isIpfsRunning(){
  pgrep -f 'ipfs daemon' > /dev/null
}


function isHardhatRunning(){
  pgrep -f 'yarn chain' > /dev/null
}


function isProduction(){
  return $RETURN_FALSE
}

function confirm(){
  read -r -p "Are you sure? [y/N] " response
  case "$response" in
      [yY][eE][sS]|[yY])
          echo "OK"
          ;;
      *)
          echo "Aborting..."
          exit 255
          ;;
  esac
}

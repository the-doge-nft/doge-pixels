#!/bin/bash

function get_ipns_dir(){
    maybeCreateIpfsKey > /dev/null 2> /dev/null
    echo "k51qzi5uqu5diavhn4gkcsei1vr4dz91sz2jgienum5ur3eq2wctiiuw22sdon"
}
function maybeCreateIpfsKey(){
  ipfs key gen $DOG_IPFS_KEY || true
}

function isIpfsRunning(){
  pgrep -f 'ipfs daemon' > /dev/null
}


function isHardhatRunning(){
  pgrep -f 'yarn chain' > /dev/null
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

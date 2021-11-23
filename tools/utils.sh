#!/bin/bash

function get_ipns_dir(){
    maybeCreateIpfsKey > /dev/null 2> /dev/null
    echo "k51qzi5uqu5diavhn4gkcsei1vr4dz91sz2jgienum5ur3eq2wctiiuw22sdon"
}
function maybeCreateIpfsKey(){
  ipfs key gen $DOG_IPFS_KEY || true
}

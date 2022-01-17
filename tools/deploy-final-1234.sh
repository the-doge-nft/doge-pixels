#!/bin/bash
# generate metadata
./deploy-final-2.sh
# upload to pinata
PINATA_SHARD_QTY=62 PINATA_SHARD_ROOT=/Users/partyka/html/NFT/dog/tools/deploy/2022-final-sharded/metadata/ node pinata.js
# zip the metadata
zip -r './deploy/2022-final-sharded.zip' ./deploy/2022-final-sharded/metadata
# upload to 2nd server
rsync --progress -rvh ./deploy/2022-final-sharded/metadata root@164.92.234.94:~/
# upload to pinata for final CID

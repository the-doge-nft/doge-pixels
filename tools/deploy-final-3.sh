#!/bin/bash
#
# deploy-rinkeby.sh
#
# Description:
# Deploy rinkeby(or hardhat). With IPFS handling.
#
set -eu
export TARGET="rinkeby"

export SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
export ROOTPATH="$SCRIPTPATH/.."
source "$SCRIPTPATH/utils.sh"

#
# DEPLOYMENT CONFIG
#
CONTINUE=yes
if [ "$CONTINUE" == "yes" ]; then
  export DEPLOY_ID=2022-final
#  export DOG_IPFS_KEY="dog-ipfs-release"
  export IPNS_DIR="k51qzi5uqu5di5wb62lm8ix9tev70ugcj8a8ikn3np2n33qnezaumg1phfzexi"
fi
export CROP=
export DEPLOY_DIR="$SCRIPTPATH/deploy/$DEPLOY_ID"

#if [ "$TARGET" == "hardhat" ]; then
#  if ! isHardhatRunning; then
#    echo "Hardhat must be running: yarn chain"
#    exit 1
#  fi
#fi
#
#if ! isIpfsRunning; then
#  echo "IPFS must be running: ipfs daemon"
#  exit 1
#fi

#
# DEPLOYMENT
#
pushd "$SCRIPTPATH"
  rm -rf ../packages/hardhat/deployments/rinkeby
  echo "============================================"
  echo "=========                          ========="
  echo "=========       💫 DEPLOY 💫       ========="
  echo "=========                          ========="
  echo "============================================"
  echo ""
  printf "%-20s %s\n" "CROP" "$CROP"
  printf "%-20s %s\n" "DEPLOY_ID" "$DEPLOY_ID"
  printf "%-20s %s\n" "IPNS_DIR" "$IPNS_DIR"
#  printf "%-20s %s\n" "DOG_IPFS_KEY" "$DOG_IPFS_KEY"
  echo ""
  # confirm
  # rm -rf "./deploy/$DEPLOY_ID/metadata" || true
  # rm "./deploy/$DEPLOY_ID.zip" || true
  echo "cleared metadata folder & zip archive"
  # 1. generate tiles
  # 2. upload to ipfs
  # 3. get root CID
  # 4. generate metadata with embeded pixels root CID
  # 5. upload metadata to IPFS
  # 6. get root CID
  # 7. deploy contracts with embeded metadata root CID

#  node ./generate-ipfs.js --deploy_dir="$SCRIPTPATH/deploy/2022-final-350" --deploy_id="2022-final-350" --ipns_dir="$IPNS_DIR" --crop="$CROP" --tile_size=350
  # node ./generate-ipfs.js --deploy_dir="$DEPLOY_DIR" --deploy_id="$DEPLOY_ID" --ipns_dir="$IPNS_DIR" --crop="$CROP"
  # exit 0
  pushd "./deploy/"
    zip -r "$DEPLOY_ID"-pixels-350x350.zip ./2022-final/pixels
  popd
  rsync  -e 'ssh -p 3311'  -rvh --progress ./deploy/"$DEPLOY_ID"-pixels-350x350.zip deploy@143.198.55.229:/home/deploy
  exit 0

  ssh deploy@143.198.55.229 << EOF
      rm -rf /home/deploy/2022-final || true
      unzip 2022-final.zip
EOF
  exit 1
  # 2. deploy ipfs
#  ./upload-ipfs.sh "$DEPLOY_DIR"
  # IPFS_DEPLOY_LOG_PATH="./deploy-logs/$DEPLOY_ID-ipfs.json"
  # 3. insert ipfs prefix to contract
  # 4. deploy conntract to rinkeby
  pushd "$ROOTPATH/packages/hardhat"
    export DOG_IPFS_DEPLOY_BASE_URI="https://ipfs.io/ipns/$IPNS_DIR/"
    export DOG_IMG_WIDTH=`cat "$DEPLOY_DIR/config.json" | jq -r '.width'`
    export DOG_IMG_HEIGHT=`cat "$DEPLOY_DIR/config.json" | jq -r '.height'`
    # todo: change to actual fees address
    export DOG_FEES_ADDRESS="0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f"
    # todo: if isProduction, run extra validation on sizes
    if isProduction; then
      set -x
      # crop cannot be used on production
      if [ "$CROP" != "" ]; then
        exit 42069
      fi
      if [ "$DOG_IMG_WIDTH" != "640" ]; then
        exit 42069
      fi
      if [ "$DOG_IMG_HEIGHT" != "480" ]; then
        exit 42069
      fi
      # todo: verify number of pixels generated
      # todo: verify ipfs pubkey
      # todo: check if uploaded ipfs files can be curl'd
      set +x
      # make last confirm before uploading contracts
#      confirm
    fi
    if [ "$TARGET" == "hardhat" ]; then
      npx hardhat deploy --network hardhat --export-all ./hardhat_contracts.json
    else
      npx hardhat deploy --network rinkeby --export-all ./hardhat_contracts.json
    fi
  popd
popd







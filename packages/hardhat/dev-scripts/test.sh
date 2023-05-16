#!/bin/bash

case $1 in
"chain")
    # spin up local net
    yarn hardhat node --network hardhat --no-deploy
    ;;

"deploy")
    # deploy local with proxy
    yarn hardhat deploy --network localhost --tags PXWPROXY --export-all ./hardhat_contracts_test.json
    ;;

"upgrade")
    # upgrade the contract
    yarn hardhat deploy --network localhost --tags PXV2 --export-all ./hardhat_contracts_test_upgrade.json
    ;;

"console")
    # repl
    yarn hardhat console --network localhost
    ;;

*)
    exit 1
    ;;
esac

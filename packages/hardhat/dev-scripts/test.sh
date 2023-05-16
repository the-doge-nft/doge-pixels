# spin up local net
yarn hardhat node --network hardhat --no-deploy

# deploy local with proxy
yarn hardhat deploy --network localhost --tags PXWPROXY --export-all ./hardhat_contracts_test.json

# upgrade the contract
yarn hardhat deploy --network localhost --tags PXV3 --export-all ./hardhat_contracts_test_upgrade.json

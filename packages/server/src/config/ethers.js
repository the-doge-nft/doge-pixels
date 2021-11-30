const ethers = require('ethers')
const { env, infura_project_id, infura_secret_id } = require('./vars')
const ABI = require('../contracts/hardhat_contracts.json')

let pxContractInfo
let network

if (env === "development") {
  network = "rinkeby"
  pxContractInfo = ABI["4"][network]["contracts"]["PX"]
} else {
  throw Error("Not ready for production yet")
}

const provider = new ethers.providers.InfuraProvider(network=network, apiKey={
  projectId: infura_project_id,
  projectSecret: infura_secret_id
})
// const provider = new ethers.providers.InfuraProvider.getWebSocketProvider(network=network, apiKey=infura_secret_id)

const PXContract = new ethers.Contract(pxContractInfo["address"], pxContractInfo["abi"], provider)

module.exports = {provider, PXContract}

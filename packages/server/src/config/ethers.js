const ethers = require('ethers')
const ABI = require('../contracts/hardhat_contracts.json')

// Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

const PX = ABI["31337"]["localhost"]["contracts"]["PX"]

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/")
const contract = new ethers.Contract(PX["address"], PX["abi"], provider)

function main() {
  console.log("main called")
  contract.on('Transfer', (from, to, value) => {
    console.log("transfer detected", from, to, value.toNumber())
  })

  contract.randYish().then(res => {
    console.log(res)
  }).catch(e => {
    console.error(e)
  })
}

module.exports = main

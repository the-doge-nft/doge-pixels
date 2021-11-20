const ethers = require('ethers')
const ABI = require('../contracts/hardhat_contracts.json')

const PX = ABI["31337"]["localhost"]["contracts"]["PX"]

const provider = new ethers.providers.JsonRpcProvider("http://host.docker.internal:8545/")
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

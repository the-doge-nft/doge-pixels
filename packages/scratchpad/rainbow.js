require("dotenv").config()
const ethers = require("ethers")
const alchemySDK = require("alchemy-sdk")
const rainbowSwapABI = require("./rainbowSwap.json")

const alchemy = new alchemySDK.Alchemy({
    apiKey: process.env.ALCHEMY_KEY,
    network: alchemySDK.Network.ETH_MAINNET
})

const rainbowSwapContractAddress = "0x00000000009726632680FB29d3F7A9734E3010E2"
const dogAddress = "0xBAac2B4491727D78D2b78815144570b9f2Fe8899"

const main = async () => {
    const getDogOrders = async () => {
        const toTxs = await alchemy.core.getAssetTransfers({
            order: alchemySDK.AssetTransfersOrder.DESCENDING,
            toAddress: rainbowSwapContractAddress,
            contractAddresses: [dogAddress],
            category: [
                alchemySDK.AssetTransfersCategory.ERC20, 
            ],
            maxCount: 3
        })
        const testTx = toTxs.transfers[0]
        const blockNumber = ethers.BigNumber.from(testTx.blockNum).toNumber()
        const hash = testTx.hash
        console.log(testTx)

        const transfers = await getAllTransfersForBlock(blockNumber, hash)
        transfers.sort((a, b) => {
            const aLogNumber = Number(a.uniqueId.split(":")[2])
            const bLogNumber = Number(b.uniqueId.split(":")[2])
            if (aLogNumber < bLogNumber) {
                return -1
            }
            return 1
        })
        console.log(transfers)
        
        const order = {}
    }

    const getAllTransfersForBlock = async (block, txHash) => {
        const toTxs = (await alchemy.core.getAssetTransfers({
            order: alchemySDK.AssetTransfersOrder.DESCENDING,
            toAddress: rainbowSwapContractAddress,
            category: [
                alchemySDK.AssetTransfersCategory.ERC20
            ],
            fromBlock: block,
            toBlock: block
        })).transfers
        const fromTxs = (await alchemy.core.getAssetTransfers({
            order: alchemySDK.AssetTransfersOrder.DESCENDING,
            fromAddress: rainbowSwapContractAddress,
            category: [
                alchemySDK.AssetTransfersCategory.ERC20
            ],
            fromBlock: block,
            toBlock: block
        })).transfers
        return toTxs.concat(fromTxs).filter(tx => tx.hash === txHash)
    }
    await getDogOrders()
    return 1
}


main()
.then(() => process.exit(0))
.catch(e => {
    console.error(e)
    process.exit(1)
})


/*
    selling DOG for WETH: https://etherscan.io/tx/0x905988a9832c39a08cf6bd2f2a303629679cec3a99c4f22057f1c48a71bf3f29
    buying DOG for WETH: https://etherscan.io/tx/0xe6282a5d068d57b11383b1ec3169abf92d691f22e8b2166dc0d7850b6983d23d 
*/

/*
QUERYING SWAP NOTES
    - query for 

*/


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
    const getDogBuys = async () => {
        const toTxs = await alchemy.core.getAssetTransfers({
            order: alchemySDK.AssetTransfersOrder.DESCENDING,
            toAddress: rainbowSwapContractAddress,
            contractAddresses: [dogAddress],
            category: [
                alchemySDK.AssetTransfersCategory.ERC20, 
                // alchemySDK.AssetTransfersCategory.EXTERNAL, 
                // alchemySDK.AssetTransfersCategory.INTERNAL
            ],
            maxCount: 3
        })
        const testTx = toTxs.transfers[0]
        const blockNumber = ethers.BigNumber.from(testTx.blockNum).toNumber()
        console.log(testTx)
        console.log(ethers.BigNumber.from(testTx.blockNum).toNumber())
        await getAllTransfersForBlock(blockNumber)
    }

    const getAllTransfersForBlock = async (block) => {
        const toTxs = await alchemy.core.getAssetTransfers({
            order: alchemySDK.AssetTransfersOrder.DESCENDING,
            toAddress: rainbowSwapContractAddress,
            category: [
                alchemySDK.AssetTransfersCategory.ERC20
            ],
            fromBlock: block,
            toBlock: block
        })
        const fromTxs = await alchemy.core.getAssetTransfers({
            order: alchemySDK.AssetTransfersOrder.DESCENDING,
            fromAddress: rainbowSwapContractAddress,
            category: [
                alchemySDK.AssetTransfersCategory.ERC20
            ],
            fromBlock: block,
            toBlock: block
        })
        console.log("toTxs\n", toTxs)
        console.log("fromTxs\n", fromTxs)
    }

    await getDogBuys()

    // const fromTxs = await alchemy.core.getAssetTransfers({
    //     order: alchemySDK.AssetTransfersOrder.DESCENDING,
    //     fromAddress: rainbowSwapContractAddress,
    //     category: [
    //         alchemySDK.AssetTransfersCategory.ERC20, 
    //         alchemySDK.AssetTransfersCategory.EXTERNAL, 
    //         // alchemySDK.AssetTransfersCategory.INTERNAL
    //     ],
    //     maxCount: 3
    // })
    // console.log(fromTxs)

    // const tx = await alchemy.core.getTransactionReceipt("0x28bddc12c8e30b411c9058d6518ff9d2f65363b449c9650095aa15faa309f482")
    // console.log(tx)

    // const iface = new ethers.utils.Interface(rainbowSwapABI)
    // tx.logs.forEach(log => {
    //     const test = iface.parseLog(log)
    //     console.log(test)
    //     const topics = log.topics
    //     const data = log.data
    //     console.log(topics)
    //     console.log(data)
    // })

    // const provider = new ethers.providers.InfuraProvider("homestead", process.env.INFURA_KEY)
    // const contract = new ethers.Contract(rainbowSwapContractAddress, rainbowSwapABI, provider)
    // const events = await contract.queryFilter("*")
    // console.log(events)

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
- incoming currency could be DOG (user is selling DOG)
    * we can query toAddress = rainbowSwapAddress && contract addresses DOG
    * follow the chain out
- outgoing currency could be DOG
    * we need to listen to all outgoing swaps 

*/


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
    const getIsAddressContract = (address) => {
        return alchemy.core.getCode(address) === "0x"
    }

    const isAddrEq = (addr1, addr2) => {
        return ethers.utils.getAddress(addr1) === ethers.utils.getAddress(addr2)
    }

    const getDogOrders = async () => {
        const toTxs = await alchemy.core.getAssetTransfers({
            order: alchemySDK.AssetTransfersOrder.DESCENDING,
            toAddress: rainbowSwapContractAddress,
            contractAddresses: [dogAddress],
            category: [
                alchemySDK.AssetTransfersCategory.ERC20, 
            ],
            maxCount: 10
        })
        for (let i = 0; i < toTxs.transfers.length; i++) {
            const transfer = toTxs.transfers[i]
            console.log(`transfer: ${transfer.hash}`)

            const blockNumber = ethers.BigNumber.from(transfer.blockNum).toNumber()
            const transfers = (await getAllTransfersForBlock(blockNumber)).filter(tx => tx.hash === transfer.hash)

            const external = transfers.filter(transfer => transfer.category === "external")
            const internal = transfers.filter(transfer => transfer.category === "internal")
            const erc20 = transfers.filter(transfer => transfer.category === "erc20")

            // console.log(transfers)
            // console.log("external", external)
            // console.log("internal", internal)
            // console.log("erc20", erc20)
            // console.log("\n")
            // console.log("\n")

            erc20.sort((a, b) => {
                const aLogNumber = Number(a.uniqueId.split(":")[2])
                const bLogNumber = Number(b.uniqueId.split(":")[2])
                if (aLogNumber < bLogNumber) {
                    return -1
                }
                return 1
            })

            let quoteOrder
            let baseOrder

            // erc20 for erc20 swap
            if (external.length === 0 && internal.length === 0) {
                quoteOrder = erc20[0]
                baseOrder = erc20[erc20.length - 1]
            } else {
                const externalToContract = external.filter(tx => isAddrEq(tx.to, rainbowSwapContractAddress))
                const internalFromContract = internal.filter(tx => isAddrEq(tx.from, rainbowSwapContractAddress))

                // console.log("externalToContract", externalToContract)
                // console.log("internalFromContract", internalFromContract)
                // console.log("\n")
                // console.log("\n")

                if (externalToContract.length > 1 || internalFromContract.length > 1) {
                    throw new Error("Shouldn't hit")
                }

                if (externalToContract.length > 0 && internalFromContract.length > 0) {
                    quoteOrder = externalToContract[0]
                    baseOrder = erc20[erc20.length - 1]
                } else if (externalToContract.length === 0) {
                    console.log('hit 1')
                    baseOrder = internalFromContract[0]
                    quoteOrder = erc20[0]
                } else {
                    console.log('hit 2')
                    quoteOrder = externalToContract[0]
                    baseOrder = erc20[erc20.length - 1]
                }
            }

            // console.log("base", baseOrder)
            // console.log("quote", quoteOrder)

            const quoteCurrency = quoteOrder.asset
            const baseCurrency = baseOrder.asset

            const quoteAmount = quoteOrder.value
            const baseAmount = baseOrder.value
            
            const price = quoteAmount / baseAmount

            console.log("base:", baseCurrency, baseAmount)
            console.log("quote:", quoteCurrency, quoteAmount)
            console.log("price:", price)
            console.log("\n\n\n")
        }

        
        // transfers.sort((a, b) => {
        //     const aLogNumber = Number(a.uniqueId.split(":")[2])
        //     const bLogNumber = Number(b.uniqueId.split(":")[2])
        //     if (aLogNumber < bLogNumber) {
        //         return -1
        //     }
        //     return 1
        // })
        // console.log(transfers)
        // const firstOrder = transfers[0]
        // const lastOrder = transfers[transfers.length - 1]
        
        // if (firstOrder.from !== lastOrder.to) {
        //     throw new Error("These are incorrect orders")
        // } else if (getIsAddressContract(firstOrder.from) || getIsAddressContract(lastOrder.to)) {
        //     throw new Error("One of your orders is a contract")
        // }

        // const baseCurrency = lastOrder.asset
        // const quoteCurrency = firstOrder.asset
        // const baseAmount = lastOrder.value
        // const quoteAmount = firstOrder.value
        // const price = quoteAmount / baseAmount
        // console.log("user sold", quoteAmount, quoteCurrency)
        // console.log("user bought", baseAmount, baseCurrency)
        // console.log(`user paid ${price} ${quoteCurrency}/${baseCurrency}`)

        // const order = {baseCurrency, quoteCurrency, baseAmount, quoteAmount, price}
        // console.log(order)
    }

    const getAllTransfersForBlock = async (block) => {
        const toTxs = (await alchemy.core.getAssetTransfers({
            order: alchemySDK.AssetTransfersOrder.DESCENDING,
            toAddress: rainbowSwapContractAddress,
            category: [
                alchemySDK.AssetTransfersCategory.ERC20,
                alchemySDK.AssetTransfersCategory.EXTERNAL,
                alchemySDK.AssetTransfersCategory.INTERNAL
            ],
            fromBlock: block,
            toBlock: block
        })).transfers
        const fromTxs = (await alchemy.core.getAssetTransfers({
            order: alchemySDK.AssetTransfersOrder.DESCENDING,
            fromAddress: rainbowSwapContractAddress,
            category: [
                alchemySDK.AssetTransfersCategory.ERC20,
                alchemySDK.AssetTransfersCategory.EXTERNAL,
                alchemySDK.AssetTransfersCategory.INTERNAL
            ],
            fromBlock: block,
            toBlock: block
        })).transfers
        return toTxs.concat(fromTxs)
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


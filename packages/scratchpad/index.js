const ethers = require("ethers")
const axios = require("axios")


const main = async () => {
    // const address = "0xA2fE1d4145443EbC027F15C9F7ca27f7e9FD5F33"
    // const otheraddress = "0xa2fe1d4145443ebc027f15c9f7ca27f7e9fd5f33"
    // const provider = ethers.getDefaultProvider()
    // const name = await provider.lookupAddress(address)
    // const otherName = await provider.lookupAddress(address)

    const { data } = await axios.get("https://chain.so/api/v2/address/doge/D8HjKf37rF3Ho7tjwe17MPN8xQ2UbHSUhB")
    const txs = data?.data?.txs
    console.log(JSON.stringify(txs, undefined, 2))
    console.log(txs.length)


    // const { data } = await axios.get("https://chain.so/api/v2/get_tx_received/doge/D8HjKf37rF3Ho7tjwe17MPN8xQ2UbHSUhB/20af2fa48cc3e8cff6e2c75ad67ea3046e45a9510b43cea6adee79845da2db8e")
    // console.log(data?.data?.txs)

    // console.log("name", name)
    // console.log("other name", otherName)
    return
}

main().then(() => process.exit(1))



// EXAMPLE SWAPPING DOG FOR ETHER

// https://etherscan.io/tx/0xafea72ed9f13e9aaf703c076b058e0214234d4dddfd0c81add167947d6e09daa
// ---------- EXTERNAL --------------
// []
// ---------- INTERNAL --------------
// [
//   {
//     "blockNum": "0xe7a0c9",
//     "uniqueId": "0xafea72ed9f13e9aaf703c076b058e0214234d4dddfd0c81add167947d6e09daa:internal:2_4",
//     "hash": "0xafea72ed9f13e9aaf703c076b058e0214234d4dddfd0c81add167947d6e09daa",
//     "from": "0x1111111254fb6c44bac0bed2854e76f90643097d",
//     "to": "0x00000000009726632680fb29d3f7a9734e3010e2",
//     "value": 0.000073056051052308,
//     "erc721TokenId": null,
//     "erc1155Metadata": null,
//     "tokenId": null,
//     "asset": "ETH",
//     "category": "internal",
//     "rawContract": {
//       "value": "0x4271aff8bf14",
//       "address": null,
//       "decimal": "0x12"
//     },
//     "metadata": {
//       "blockTimestamp": "2022-07-20T14:09:39.000Z"
//     }
//   },
//   {
//     "blockNum": "0xe7a0c9",
//     "uniqueId": "0xafea72ed9f13e9aaf703c076b058e0214234d4dddfd0c81add167947d6e09daa:internal:4",
//     "hash": "0xafea72ed9f13e9aaf703c076b058e0214234d4dddfd0c81add167947d6e09daa",
//     "from": "0x00000000009726632680fb29d3f7a9734e3010e2",
//     "to": "0x5b570f0f8e2a29b7bcbbfc000f9c7b78d45b7c35",
//     "value": 0.000072435074618364,
//     "erc721TokenId": null,
//     "erc1155Metadata": null,
//     "tokenId": null,
//     "asset": "ETH",
//     "category": "internal",
//     "rawContract": {
//       "value": "0x41e11ae453fc",
//       "address": null,
//       "decimal": "0x12"
//     },
//     "metadata": {
//       "blockTimestamp": "2022-07-20T14:09:39.000Z"
//     }
//   }
// ]
// ---------- ERC20 --------------
// [
//   {
//     "blockNum": "0xe7a0c9",
//     "uniqueId": "0xafea72ed9f13e9aaf703c076b058e0214234d4dddfd0c81add167947d6e09daa:log:464",
//     "hash": "0xafea72ed9f13e9aaf703c076b058e0214234d4dddfd0c81add167947d6e09daa",
//     "from": "0x5b570f0f8e2a29b7bcbbfc000f9c7b78d45b7c35",
//     "to": "0x00000000009726632680fb29d3f7a9734e3010e2",
//     "value": 104.1438636721609,
//     "erc721TokenId": null,
//     "erc1155Metadata": null,
//     "tokenId": null,
//     "asset": "DOG",
//     "category": "erc20",
//     "rawContract": {
//       "value": "0x05a549543b63dc0106",
//       "address": "0xbaac2b4491727d78d2b78815144570b9f2fe8899",
//       "decimal": "0x12"
//     },
//     "metadata": {
//       "blockTimestamp": "2022-07-20T14:09:39.000Z"
//     }
//   },
//   {
//     "blockNum": "0xe7a0c9",
//     "uniqueId": "0xafea72ed9f13e9aaf703c076b058e0214234d4dddfd0c81add167947d6e09daa:log:467",
//     "hash": "0xafea72ed9f13e9aaf703c076b058e0214234d4dddfd0c81add167947d6e09daa",
//     "from": "0x00000000009726632680fb29d3f7a9734e3010e2",
//     "to": "0xc96f20099d96b37d7ede66ff9e4de59b9b1065b1",
//     "value": 104.1438636721609,
//     "erc721TokenId": null,
//     "erc1155Metadata": null,
//     "tokenId": null,
//     "asset": "DOG",
//     "category": "erc20",
//     "rawContract": {
//       "value": "0x05a549543b63dc0106",
//       "address": "0xbaac2b4491727d78d2b78815144570b9f2fe8899",
//       "decimal": "0x12"
//     },
//     "metadata": {
//       "blockTimestamp": "2022-07-20T14:09:39.000Z"
//     }
//   }
// ]

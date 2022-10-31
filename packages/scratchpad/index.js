const ethers = require("ethers")


const main = async () => {
    const address = "0xA2fE1d4145443EbC027F15C9F7ca27f7e9FD5F33"
    const otheraddress = "0xa2fe1d4145443ebc027f15c9f7ca27f7e9fd5f33"
    const provider = ethers.getDefaultProvider()
    const name = await provider.lookupAddress(address)
    const otherName = await provider.lookupAddress(address)
    console.log("name", name)
    console.log("other name", otherName)
    return
}

main().then(() => process.exit(1))

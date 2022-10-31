

// options
// block.io
// cryptoapis
// blockchair
// dogechain.info
// blockcypher.com
// chain.so

const axios = require("axios")
const Websocket = require("ws")
const Pusher = require("pusher-js")


const sleep = (sec) => setTimeout(() => {}, [1000 * sec])
class DogeChain {
    async getUnspent(address) {
        const {data} = await axios.get(`https://dogechain.info/api/v1/unspent/${myAddress}`)
        return data
    }

    async getAmountSent(address) {
        const { data } = await axios.get(`https://dogechain.info/api/v1/address/sent/${myAddress}`)
        return data
    }

    async getTx(hash) {
        const { data } = await axios.get(`https://dogechain.info//api/v1/transaction/${hash}`)
        return data
    }

    async getTxForAllUnspent(address) {
        const unspent = await client.getUnspent(myAddress)
        for (let i = 0; i < unspent.unspent_outputs.length; i++) {
            const tx = unspent.unspent_outputs[i]
            const data = await client.getTx(tx.tx_hash)
            console.log(JSON.stringify(data, undefined, 2))
        }
    }

    testWs() {
        const wss = new Websocket("wss://ws.dogechain.info/inv")
        wss.onopen = function() {
            console.log("ws open")
            wss.send(JSON.stringify({op: "addr_sub", addr: myAddress}))
        }

        wss.onmessage = function(e) {
            const data = JSON.parse(e.data)
            console.log(data)
        }

        wss.onclose = function(e) {
            console.log("ws closed")
        }
    }
}

class ChainSo {
    baseUrl = "https://chain.so/api/v2"

    async getDogeInfo() {
        const { data } = await axios.get(this.baseUrl + "/get_info/DOGE")
        return data
    }
}

const main = async () => {
    const client = new DogeChain()
    const chainSo = new ChainSo()

    const address = "D8HjKf37rF3Ho7tjwe17MPN8xQ2UbHSUhB"
    const myAddress = "DFEmbNXw53xLWYwgmSP6w2SKhawKz3XZaU"
}

main()

// main()
// .then(() => process.exit(0))
// .catch(e => {
//     console.error(e)
//     process.exit(1)
// })


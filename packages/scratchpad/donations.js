

// options
// block.io
// cryptoapis
// blockchair
// dogechain.info
// blockcypher.com

const axios = require("axios")
const Websocket = require("ws")


const sleep = (sec) => setTimeout(() => {}, [1000 * sec])


const main = async () => {


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
    }

    const client = new DogeChain()

    const address = "D8HjKf37rF3Ho7tjwe17MPN8xQ2UbHSUhB"
    const myAddress = "DFEmbNXw53xLWYwgmSP6w2SKhawKz3XZaU"

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

main()

// main()
// .then(() => process.exit(0))
// .catch(e => {
//     console.error(e)
//     process.exit(1)
// })


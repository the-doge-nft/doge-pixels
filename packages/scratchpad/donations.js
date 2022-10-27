

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

<<<<<<< HEAD
class ChainSo {
    baseUrl = "https://chain.so/api/v2"

    async getReceivedTxs(address) {
        /*
            https://chain.so/api/#change-log
            Enabled pagination for get_unspent_tx, get_received_tx, and get_spent_tx. The APIs are now limited to 100 transactions per call, 
            and you can retrieve transactions that occurred specifically after a certain transaction ID. The script field in these API calls 
            is now called script_asm, and we have added script_hex alongside the ASM as well. API calls affected are: Get Unspent Tx, 
            Get Received Tx, and Get Spent Tx. These API calls now return a maximum of 100 unconfirmed transactions as well.
        */
        const { data } = await axios.get(this.baseUrl +  `/get_tx_received/DOGE/${address}`)
        return data
=======
    const client = new DogeChain()

    const address = "D8HjKf37rF3Ho7tjwe17MPN8xQ2UbHSUhB"
    const myAddress = "DFEmbNXw53xLWYwgmSP6w2SKhawKz3XZaU"

    const wss = new Websocket("wss://ws.dogechain.info/inv")

    const subToAddress = () => {
        console.log("subbing to address: " + myAddress)
        wss.send(JSON.stringify({op: "addr_sub", addr: myAddress}))
    }

    wss.onopen = function() {
        console.log("ws open")
        // subToAddress()
        wss.send(JSON.stringify({op: "blocks_sub"}))
>>>>>>> fcc57604f55ce6cec1110fb0f15931dece992c35
    }

    async getDogeInfo() {
        const { data } = await axios.get(this.baseUrl + "/get_info/DOGE")
        return data
    }
<<<<<<< HEAD

    listenForBalanceUpdates(address) {
        // Pusher.host = 'pusher.chain.so'
        // Pusher.ws_port = 443
        // Pusher.wss_port = 443
        Pusher.log = function(message) {
            console.log(message)
        }
        const pusher = new Pusher("e9f5cc20074501ca7395", {cluster: "pusher.chain.so", encrypted: true, disabledTransports: ['sockjs'], enabledStats: false})
        
        pusher.connection.bind('state_change', function(state) {
            console.log(state)
        })
        
        // const ticker = pusher.subscribe(`address_doge_${address}`)
        const blockchainChannel = pusher.subscribe(`blockchain_update_doge`)
        blockchainChannel.bind('tx_update', function(data) {
            console.log(data)
        })

        blockchainChannel.bind('block_update', function(data) {
            console.log(data)
        })
    }
}


const main = async () => {
    const client = new DogeChain()
    const chainSo = new ChainSo()

    const address = "D8HjKf37rF3Ho7tjwe17MPN8xQ2UbHSUhB"
    const myAddress = "DFEmbNXw53xLWYwgmSP6w2SKhawKz3XZaU"

    // const data = await chainSo.getReceivedTxs(myAddress)
    // console.log(data.data.txs)
    chainSo.listenForBalanceUpdates(myAddress)
=======
>>>>>>> fcc57604f55ce6cec1110fb0f15931dece992c35
}

main()

// main()
// .then(() => process.exit(0))
// .catch(e => {
//     console.error(e)
//     process.exit(1)
// })


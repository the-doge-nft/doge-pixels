const axios = require("axios");
const vars = require("../config/vars");

class _NomicsClient {

  axiosClient

  constructor() {
    console.log("Creating client")
    this.axiosClient = axios.create({
      baseURL: 'https://api.nomics.com/v1',
      params: {
        key: vars.nomics_api_key
      },
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  getDOGPrice(ticker) {
    return this.axiosClient.get('/currencies/ticker', {
      params: {
        ids: "DOG4",
      }
    })
  }
}

const nomicsClient = new _NomicsClient()
module.exports = nomicsClient

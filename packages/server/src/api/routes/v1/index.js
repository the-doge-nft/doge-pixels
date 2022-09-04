const express = require('express')
const {redisClient} = require('../../../config/redis')
const {PXContract, provider, DOGContract, getProvider, getDOGContract, EthersClient} = require("../../../config/ethers");
const logger = require("../../../config/config");
const {getAddressToOwnershipMap} = require("../../web3/px");
const {ethers} = require("ethers");
const axios = require("axios");
const TokenNotMintedError = require("../../errors/TokenNotMintedError");
const nomicsClient = require("../../../services/Nomics");

const router = express.Router()

router.get(
  '/status',
  (req, res) => res.send('much wow')
)

router.get(
  '/config',
  async (req, res) => {
    const data = await redisClient.get(redisClient.keys.ADDRESS_TO_TOKENID)
    res.send(JSON.parse(data))
  }
)

router.get(
  '/config/refresh',
  async (req, res) => {
    await getAddressToOwnershipMap(EthersClient)
    const data = await redisClient.get(redisClient.keys.ADDRESS_TO_TOKENID)
    res.send(JSON.parse(data))
  }
)

router.get(
  '/px/dimensions',
  async (req, res) => {
    const cache = await redisClient.get(redisClient.keys.SHIBA_DIMENSIONS)
    if (cache) {
      res.send(JSON.parse(cache))
    } else {
      const width = await EthersClient.PXContract.SHIBA_WIDTH()
      const height = await EthersClient.PXContract.SHIBA_HEIGHT()
      const data = {width: width.toNumber(), height: height.toNumber()}
      redisClient.set(redisClient.keys.SHIBA_DIMENSIONS, JSON.stringify(data))
      res.send(data)
    }
  }
)

router.get(
  '/px/balance/:address',
  async (req, res) => {
    //@TODO: check if ETH address is valid
    //@TODO: could pull balance from keys.ADDRESS_TO_TOKENID
    const { address } = req.params
    const balance = await EthersClient.PXContract.balanceOf(address)
    if (balance) {
      res.send({balance: balance.toNumber()})
    } else {
      res.send({balance: 0})
    }
  }
)

router.get(
  '/px/owner/:tokenID',
  async (req, res, next) => {
    const { tokenID } = req.params
    logger.info(`querying token ID owner: ${tokenID}`)
    try {
      const data = await redisClient.get(redisClient.keys.ADDRESS_TO_TOKENID)
      if (data) {
        const check = JSON.parse(data)
        for (const address in check) {
          if (check[address] && check[address].tokenIDs) {
            if (check[address].tokenIDs.includes(Number(tokenID))) {
              return res.send({address})
            }
          }
        }
      }

      throw Error()
    } catch (e) {
      e.message = "No address found"
      next(e)
    }
  }
)

router.get(
  '/px/metadata/:tokenID',
  async (req, res, next) => {
    const { tokenID } = req.params
    logger.info(`querying token ID metatdata: ${tokenID}`)

    const redisKey = redisClient.getTokenMetadataKey(tokenID)
    const tokenNotMintedMessage = "NOT_MINTED"

    try {
      const cache = await redisClient.get(redisKey)
      if (cache) {
        if (cache === tokenNotMintedMessage) {
          throw new TokenNotMintedError()
        }
        logger.info(`returning cached metadata for: ${tokenID}`)
        res.send(JSON.parse(cache))
      } else {
        const tokenURI = await EthersClient.PXContract.tokenURI(tokenID)
        const uri = await axios.get(tokenURI)
        const metadata = uri.data
        await redisClient.set(redisKey, JSON.stringify(metadata))

        logger.info(`returning fresh metadata: ${tokenID}`)
        res.send(metadata)
      }
    } catch (e) {
      if (e instanceof TokenNotMintedError) {
        logger.info("known non-minted token, continuing")
      } else {

        try {
          // difficult to extract exact reason from the chain
          // https://github.com/ethers-io/ethers.js/issues/368
          const tokenNotMintedErrorString = "execution reverted: ERC721Metadata: URI query for nonexistent token"
          const errorMessage = JSON.parse(e.error.response).error.message
          const isTokenNotMinted = errorMessage === tokenNotMintedErrorString
          if (isTokenNotMinted) {
            logger.info("non minted token hit. setting cache to not-minted")
            await redisClient.set(redisKey, tokenNotMintedMessage)
          }
        } catch (e) {
          logger.error(e)
        }
      }

      e.message = "Could not get metadata, token may not exist"
      next(e)
    }
  }
)

router.get(
  '/ens/:address',
  async (req, res, next) => {
    try {
      const { address } = req.params
      const ens = await EthersClient.provider.lookupAddress(address)
      res.send({ens: ens})
    } catch (e) {
      next(e)
    }
  }
)

router.get(
  '/dog/locked',
  async (req, res, next) => {
    try {
      const balance = await EthersClient.DOGContract.balanceOf(EthersClient.PXContract.address)
      res.send({balance: ethers.utils.formatEther(balance)})
    } catch (e) {
      next(e)
    }
  }
)

router.get(
  '/contract/addresses',
  async (req, res, next) => {
    try {
      res.send({
        dog: EthersClient.DOGContract.address,
        pixel: EthersClient.PXContract.address
      })
    } catch (e) {
      next(e)
    }
  }
)

router.get(
  '/px/price',
  async (req, res, next) => {
    try {
      const { data } = await nomicsClient.getDOGPrice()
      const usdPrice = Number(data[0].price)
      const dogPerPixel = 55239.89899
      return res.send({
        price: usdPrice * dogPerPixel
      })
    } catch (e) {
      next(e)
    }
  }
)

module.exports = router;


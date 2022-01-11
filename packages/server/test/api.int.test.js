const app = require("../src/config/express")
const supertest = require("supertest")
const {redisClient} = require("../src/config/redis");
const {ethers, upgrades} = require("hardhat");
const testABI = require("./contracts/hardhat_contracts.json")
const {BigNumber} = require("ethers");
const {main: pxMain} = require("../src/api/web3/px");
const {EthersClient} = require("../src/config/ethers");

const request = supertest(app)
jest.setTimeout(10 * 1000)

beforeAll(() => {

})

afterAll(() => {
  redisClient.client.disconnect()
  EthersClient.provider._websocket.close()
})

it('Returns the kobosu width and height', async () => {
  const testDimensions = async () => {
    // first call to hit contract
    let res = await request.get("/v1/px/dimensions")
    let body = res.body
    expect(body.width).toEqual(640)
    expect(body.height).toEqual(480)
  }


  // one call to get data from the contract
  await testDimensions()
  // another call to test the cache
  await testDimensions()
})

it('Testing getting signers', (done) => {
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545")
  const signer = provider.getSigner(0)
  const pxContractInfo = testABI["31337"]["localhost"]["contracts"]["PX"]
  const dogContractInfo = testABI["31337"]["localhost"]["contracts"]["DOG20"]

  const PXContract = new ethers.Contract(pxContractInfo["address"], pxContractInfo["abi"], signer)
  const DOGContract = new ethers.Contract(dogContractInfo["address"], dogContractInfo["abi"], signer)

  signer.getAddress().then(signerAddress => {
    const DOG_TO_PIXEL_SATOSHIS = BigNumber.from("55239898990000000000000")
    DOGContract.initMock([signerAddress], DOG_TO_PIXEL_SATOSHIS.mul(10)).then(_ => {
      DOGContract.approve(pxContractInfo["address"], DOG_TO_PIXEL_SATOSHIS.mul(10)).then(() => {
        PXContract.mintPuppers(5).then(() => {
          PXContract.balanceOf(signerAddress).then(pupperBalance => {
            expect(pupperBalance.toNumber()).toEqual(5)
            request.get("/v1/config/refresh").then(res => {
              expect(res.body[signerAddress].tokenIDs.length).toEqual(5)
              done()
            })
          })
        })
      })
    })
  })
})

const sleep = async (ms) => {
  await new Promise(r => setTimeout(r, ms));
}



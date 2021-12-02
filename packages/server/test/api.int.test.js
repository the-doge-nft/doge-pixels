const app = require("../src/config/express")
const supertest = require("supertest")
const {redisClient} = require("../src/config/redis");
const {ethers, upgrades} = require("hardhat");
const testABI = require("./contracts/hardhat_contracts.json")
const {BigNumber} = require("ethers");
const pxMain = require("../src/api/web3/px");
const {PXContract} = require("../src/config/ethers");

const request = supertest(app)
jest.setTimeout(10 * 1000)

beforeAll(() => {
  // listen for events on the px contract
  pxMain()
})

afterAll(() => {
  redisClient.disconnect()
  PXContract.removeAllListeners()
})

it('Testing to see if jest works', async () => {
  const res = await request.get("/v1/test")
  console.log(res.text)
  return
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

it('Testing getting signers', async () => {
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545")
  const signer = provider.getSigner(0)
  const pxContractInfo = testABI["31337"]["localhost"]["contracts"]["PX"]
  const dogContractInfo = testABI["31337"]["localhost"]["contracts"]["DOG20"]

  const PXContract = new ethers.Contract(pxContractInfo["address"], pxContractInfo["abi"], signer)
  const DOGContract = new ethers.Contract(dogContractInfo["address"], dogContractInfo["abi"], signer)

  const address = await signer.getAddress()
  const DOG_TO_PIXEL_SATOSHIS = BigNumber.from("55239898990000000000000")
  await DOGContract.initMock([address], DOG_TO_PIXEL_SATOSHIS.mul(10));

  await DOGContract.approve(pxContractInfo["address"], DOG_TO_PIXEL_SATOSHIS.mul(10))
  await PXContract.mintPuppers(5)
  const pupperBalance = await PXContract.balanceOf(address)
  expect(pupperBalance.toNumber()).toEqual(5)

  await sleep(2000)

  const res = await request.get("/v1/config")
  console.log("res: ", res.body)
})

const sleep = async (ms) => {
  await new Promise(r => setTimeout(r, ms));
}



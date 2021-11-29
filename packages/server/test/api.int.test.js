const app = require("../src/config/express")
const supertest = require("supertest")
const {redisClient} = require("../src/config/redis");

const request = supertest(app)
jest.setTimeout(3 * 1000)

afterAll(() => {
  redisClient.disconnect()
})

it('Testing to see if jest works', async () => {
  const res = await request.get("/v1/test")
  console.log(res.text)
  return
})

it('Returns the kobosu width and height', async () => {
  const res = await request.get("/v1/px/dimensions")
  const body = res.body
  expect(body.width).toEqual(12)
  expect(body.height).toEqual(9)

  const _res = await request.get("/v1/px/dimensions")
  const _body = res.body
})

it('Testing getting signers', async () => {

})

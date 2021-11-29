const app = require("../src/config/express")
const supertest = require("supertest")

const request = supertest(app)

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
})

it('Testing getting signers', async () => {

})

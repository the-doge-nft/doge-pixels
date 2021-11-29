const app = require("../src/config/express")
const supertest = require("supertest")

beforeAll(done => {
  console.log("before")
  done()
})

afterAll(done => {
  // Closing the DB connection allows Jest to exit successfully.
  // mongoose.connection.close()
  console.log("after")
  done()
})

// beforeEach((done) => {
//   console.log("running before the test")
//   done()
// })

it('Testing to see if jest works', () => {
  expect(1).toBe(1)
})
const request = require('supertest')
const app = require('../server')

describe('Index', () => {
  it('Index load test', async () => {
    const res = await request(app)
      .get('/')
    expect(res.statusCode).toEqual(200)
  })
})
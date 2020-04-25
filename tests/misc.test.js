const request = require('supertest')

process.env.TESTING = 1;
const app = require('../server')

describe('Misc', () => {
  it('Index view', async () => {
    const res = await request(app)
      .get('/')
    expect(res.statusCode).toEqual(200)
  })
  it('Export view', async () => {
    const res = await request(app)
      .get('/export/')
    expect(res.statusCode).toEqual(200)
  })
})
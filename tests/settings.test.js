const request = require('supertest')

process.env.TESTING = 1;
const app = require('../server')

describe('Views', () => {
  it('Settings', async () => {
    const res = await request(app)
      .get('/settings/')
    expect(res.statusCode).toEqual(200)
  })
  it('Add user', async () => {
    const res = await request(app)
      .get('/settings/addUser')
    expect(res.statusCode).toEqual(200)
  })
})
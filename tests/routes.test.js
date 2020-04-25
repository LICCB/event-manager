const request = require('supertest')

process.env.TESTING = 1;
const app = require('../server')

describe('Index', () => {
  it('Index load test', async () => {
    const res = await request(app)
      .get('/')
    expect(res.statusCode).toEqual(200)
  })
})

describe('Participants', () => {
  it('All participants test', async () => {
    const res = await request(app)
      .get('/participants/')
    expect(res.statusCode).toEqual(200)
  })
})

describe('Events', () => {
  it('All events test', async () => {
    const res = await request(app)
      .get('/events/')
    expect(res.statusCode).toEqual(200)
  })
})
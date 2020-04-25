const request = require('supertest')

process.env.TESTING = 1;
const app = require('../server')

describe('Views', () => {
  it('All events view', async () => {
    const res = await request(app)
      .get('/events/')
    expect(res.statusCode).toEqual(200)
  })
  it('Create event view', async () => {
    const res = await request(app)
      .get('/createEvent/')
    expect(res.statusCode).toEqual(200)
  })
  it('Event detail view', async () => {
    const res = await request(app)
      .get('/event/123e4567-e89b-12d3-a456-556642440000')
    expect(res.statusCode).toEqual(200)
  })
  it('Edit event view', async () => {
    const res = await request(app)
      .get('/editEvent/123e4567-e89b-12d3-a456-556642440000')
    expect(res.statusCode).toEqual(200)
  })
  it('Checkin view', async () => {
    const res = await request(app)
      .get('/event/123e4567-e89b-12d3-a456-556642440000/checkin')
    expect(res.statusCode).toEqual(200)
  })
})
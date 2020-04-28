const request = require('supertest')

process.env.LICCB_MODE = 'testing';
const app = require('../server')

describe('Views', () => {
  it('All participants view', async () => {
    const res = await request(app)
      .get('/participants/')
    expect(res.statusCode).toEqual(200)
  })
  it('Single participant #1', async () => {
    const res = await request(app)
      .get('/participant/2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d')
    expect(res.statusCode).toEqual(200)
  })
  it('Single participant #2', async () => {
    const res = await request(app)
      .get('/participant/f1426989-b6a0-4358-8c10-be0e5cd41645')
    expect(res.statusCode).toEqual(200)
  })
  it('Single participant #3', async () => {
    const res = await request(app)
      .get('/participant/98cabaaa-41b6-40ed-a203-0ad96f78c72e')
    expect(res.statusCode).toEqual(200)
  })
  it('Single participant #4', async () => {
    const res = await request(app)
      .get('/participant/3c1da2d1-113b-4c0b-9de8-08b24cca5f5d')
    expect(res.statusCode).toEqual(200)
  })
  it('Single participant #5', async () => {
    const res = await request(app)
      .get('/participants/tie/3e0b1bba-ba98-4e44-a7c0-6793a03e8821')
    expect(res.statusCode).toEqual(200)
  })
  it('Tie participant #1', async () => {
    const res = await request(app)
      .get('/participants/tie/2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d')
    expect(res.statusCode).toEqual(200)
  })
  it('Tie participant #2', async () => {
    const res = await request(app)
      .get('/participants/tie/f1426989-b6a0-4358-8c10-be0e5cd41645')
    expect(res.statusCode).toEqual(200)
  })
  it('Tie participant #3', async () => {
    const res = await request(app)
      .get('/participants/tie/98cabaaa-41b6-40ed-a203-0ad96f78c72e')
    expect(res.statusCode).toEqual(200)
  })
  it('Tie participant #4', async () => {
    const res = await request(app)
      .get('/participants/tie/3c1da2d1-113b-4c0b-9de8-08b24cca5f5d')
    expect(res.statusCode).toEqual(200)
  })
  it('Tie participant #5', async () => {
    const res = await request(app)
      .get('/participants/tie/3e0b1bba-ba98-4e44-a7c0-6793a03e8821')
    expect(res.statusCode).toEqual(200)
  })
})
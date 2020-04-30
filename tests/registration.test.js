const request = require('supertest')

process.env.LICCB_MODE = 'testing';
const app = require('../server')

describe('Views', () => {
  it('Participant class selection view', async () => {
    const res = await request(app)
      .get('/signup/')
    expect(res.statusCode).toEqual(200)
  })
  it('Volunteer class events view', async () => {
    const res = await request(app)
      .get('/signupEventList/1')
    expect(res.statusCode).toEqual(200)
  })
  it('Partcipant class events view', async () => {
    const res = await request(app)
      .get('/signupEventList/0')
    expect(res.statusCode).toEqual(200)
  })
  it('Volunteer class signup view', async () => {
    const res = await request(app)
      .get('/eventSignup/123e4567-e89b-12d3-a456-556642440000/1')
    expect(res.statusCode).toEqual(200)
  })
  it('Participant class signup view', async () => {
    const res = await request(app)
      .get('/eventSignup/123e4567-e89b-12d3-a456-556642440000/0')
    expect(res.statusCode).toEqual(200)
  })
  it('Signup thanks', async () => {
    const res = await request(app)
      .get('/signup/signupThanks')
    expect(res.statusCode).toEqual(200)
  })
})
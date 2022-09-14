import app from '../../src/app'
import request from 'supertest'

describe('Confirm Email middleware', () => {
  let uid: number
  let token: string

  beforeAll(async () => {
    await app.service('accounts').create({
      username: 'test',
      email: 'test',
      password: 'test'
    }).then((resp: any) => {
      uid = resp.id
      token = resp.verificationToken
    })
  })

  afterAll(async () => {
    await app.service('accounts').find({query: {email: 'test'}})
      .then(async(resp: any) => {
        await app.service('accounts').remove(resp.data[0].id)
      })
  })

  it('should return a 400 with no params', async () => {
    await request(app).post('/confirmEmail').send({}).expect(400)
  })

  it('should return a 200 and change values in db with correct token', async () => {
    const response = await request(app)
      .post('/confirmEmail')
      .send({ uid, token })
    expect(response.status).toBe(200)
    expect(response.text).toBe('Email verified')
    const testUser: any  = await app.service('accounts').find({query: {email: 'test'}})
    expect(testUser.data[0].emailVerified).toBeTruthy()
    expect(testUser.data[0].verificationToken).toBeNull()
  })

  it('should return a 400 with wrong token', async () => {
    const response = await request(app)
      .post('/confirmEmail')
      .send({ uid, token: 'wrong token' })
    expect(response.status).toBe(400)
  })
})
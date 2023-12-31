import app from '../../src/app'
// @ts-expect-error
import request from 'supertest'
// @ts-expect-error
import getAuthenticationToken from '../helpers/get-authentication-token'
// @ts-expect-error
import sendAuthenticatedRequest from '../helpers/send-authenticated-request'

const accounts = app.service('accounts')
describe('editors middleware', () => {
  let editorId: number
  let studentId: number

  beforeAll(async () => {
    await accounts.create({
      username: 'myEditor',
      email: 'the@editor.de',
      password: 'veryverysecret',
      role: 'editor'
    })
      .then((resp: any) => {
        editorId = resp.id
      })

    await accounts.create({
      username: 'myNonEditor',
      email: 'the@normaluser.de',
      password: 'veryverysecret'
    })
      .then((resp: any) => {
        studentId = resp.id
      })
  })

  afterAll(async () => {
    await accounts.remove(editorId)
    await accounts.remove(studentId)
  })

  it('fails for non-authenticated request', async () => {
    await request(app)
      .get('/accounts/editors')
      .expect(401)
  })

  it('fails with wrong http method', async () => {
    const token = await getAuthenticationToken('the@editor.de', 'veryverysecret')
    await sendAuthenticatedRequest(app, 'post', '/accounts/editors', token)
      .then((resp: any) => {
        expect(resp.status).toBe(405)
      })
  })

  it('fails for non-editor request', async () => {
    const resp = await request(app)
      .post('/authentication')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ strategy: 'local', email: 'the@normaluser.de', password: 'veryverysecret' })

    const token: string = resp.body.accessToken
    await request(app)
      .get('/accounts/editors')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
  })

  it('succeeds for editor request', async () => {
    const token = await getAuthenticationToken('the@editor.de', 'veryverysecret')
    const resp = await sendAuthenticatedRequest(app, 'get', '/accounts/editors', token)
    expect(resp.status).toBe(200)
    expect(resp.body.editors).toBeGreaterThanOrEqual(1)
  })
})

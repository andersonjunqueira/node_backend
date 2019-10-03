import moment from 'moment'

import log from '../../fixtures/log'
import makeDb, { clearDb } from '../../fixtures/db'
import makeFakeUser from '../../fixtures/user'

import makeUsersDb from '../../../src/data-access/users-db'
import makeTokensDb from '../../../src/data-access/tokens-db'
import makePostLogin from '../../../src/controllers/postLogin'
import makeLogin from '../../../src/use-cases/login'
import md5 from '../../../src/md5'

describe('post login', () => {
  let usersDb
  let tokensDb
  let postLogin
  let login

  beforeEach(async () => {
    await makeDb()
    await clearDb()
    usersDb = makeUsersDb({ makeDb })
    tokensDb = makeTokensDb({ makeDb })
    login = makeLogin({ usersDb, tokensDb, md5, moment, log })
    postLogin = makePostLogin({ login, log })
  })

  it('should return a token', async () => {
    try {

      const user = makeFakeUser()
      const password = user.password
      user.password = md5(user.password)
      await usersDb.insert(user)

      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path: '/api/v0/login',
        requestURL: `http://localhost:3000/api/v0/login`,
        body: { email: user.email, password }
      }

      const response = await postLogin(request)
      expect(response.body).toBeTruthy()
      expect(response.statusCode).toBe(200)
      expect(response.body.accessToken).toBeTruthy()

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })

  it('should not login (no user)', async () => {
    try {

      const user = makeFakeUser()
      const password = user.password
      user.password = md5(user.password)
      await usersDb.insert(user)

      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path: '/api/v0/login',
        requestURL: `http://localhost:3000/api/v0/login`,
        body: { password }
      }

      const response = await postLogin(request)
      expect(response.body).toBeTruthy()
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBeTruthy()
      expect(response.body.error.message).toBe('e-mail and password are mandatory.')

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })

  it('should not login (no password)', async () => {
    try {

      const user = makeFakeUser()
      user.password = md5(user.password)
      await usersDb.insert(user)

      const request = {
        headers: {
          'Content-Type': 'application/json',
        },
        path: '/api/v0/login',
        requestURL: `http://localhost:3000/api/v0/login`,
        body: { email: user }
      }

      const response = await postLogin(request)
      expect(response.body).toBeTruthy()
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBeTruthy()
      expect(response.body.error.message).toBe('e-mail and password are mandatory.')

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })

})

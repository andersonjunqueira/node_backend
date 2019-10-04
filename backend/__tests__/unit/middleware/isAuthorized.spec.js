import moment from 'moment'

import makeDb, { clearDb } from '../../fixtures/db'
import makeFakeUser from '../../fixtures/user'
import log from '../../fixtures/log'
import Response from '../../fixtures/Response'

import makeUsersDb from '../../../src/data-access/users-db'
import makeTokensDb from '../../../src/data-access/tokens-db'
import makeToken from '../../../src/entities/token'
import makeCreateAccount from '../../../src/use-cases/createAccount'
import makeCheckToken from '../../../src/use-cases/checkToken'
import makeIsAuthorized from '../../../src/middlewares/isAuthorized'
import md5 from '../../../src/md5'
import jwt from '../../../src/jwt'

describe('isAuthorized middleware', () => {
  let usersDb
  let tokensDb
  let checkToken
  let isAuthorized
  let createAccount
  let next = (param) => param

  beforeEach(async () => {
    await makeDb()
    await clearDb()
    usersDb = makeUsersDb({ makeDb })
    tokensDb = makeTokensDb({ makeDb })
    checkToken = makeCheckToken({ usersDb, tokensDb, jwt, moment, log })
    isAuthorized = makeIsAuthorized({ checkToken, tokenType: 'LOGIN', log })
    createAccount = makeCreateAccount({ usersDb, md5, log })
  })

  it('should not check an empty token', async () => {
    try {
      const request = {
        headers: {
          'Content-Type': 'application/json'
        },
        path: '/api/users/123456',
        requestURL: `http://localhost:3000/api/users/123456`,
        params: { id: '123456' }
      }

      const response = new Response()
      await isAuthorized(request, response, next)
      expect(response.status()).toBe(401)
      expect(response.error().message).toBe('Authentication header not present.')

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })

  it('should not authenticate with inexistent token', async () => {
    try {
      const request = {
        headers: {
          'Content-Type': 'application/json',
          'Authentication': 'Bearer 123456'
        },
        path: '/api/users/123456',
        requestURL: `http://localhost:3000/api/users/123456`,
        params: { id: '123456' }
      }

      const response = new Response()
      await isAuthorized(request, response, next)
      expect(response.status()).toBe(401)
      expect(response.error().message).toBe('Invalid token.')

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })

  it('should not authenticate with an expired token', async () => {
    try {
      const userInfo = makeFakeUser()
      const user = await createAccount({ fullName: userInfo.fullName, email: userInfo.email, password: userInfo.password })

      const exp = moment.utc(Date.now()).subtract(1, 'hours').valueOf()
      const tokenInfo = makeToken({ user, exp })
      const token = await tokensDb.insert({
        id: tokenInfo.getId(),
        userId: tokenInfo.getUserId(),
        accessToken: tokenInfo.getAccessToken(),
        type: tokenInfo.getType()
      })

      const request = {
        headers: {
          'Content-Type': 'application/json',
          'Authentication': `Bearer ${token.accessToken}`
        },
        path: `/api/users/${user.id}`,
        requestURL: `http://localhost:3000/api/users/${user.id}`,
        params: { id: user.id }
      }

      const response = new Response()
      await isAuthorized(request, response, next)
      expect(response.status()).toBe(401)
      expect(response.error().message).toBe('Expired token found.')

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })

  it('should authenticate the request', async () => {
    try {
      const userInfo = makeFakeUser()
      const user = await createAccount({ fullName: userInfo.fullName, email: userInfo.email, password: userInfo.password })

      const tokenInfo = makeToken({ user })
      const token = await tokensDb.insert({
        id: tokenInfo.getId(),
        userId: tokenInfo.getUserId(),
        accessToken: tokenInfo.getAccessToken(),
        type: tokenInfo.getType()
      })

      const request = {
        headers: {
          'Content-Type': 'application/json',
          'Authentication': `Bearer ${token.accessToken}`
        },
        path: `/api/users/${user.id}`,
        requestURL: `http://localhost:3000/api/users/${user.id}`,
        params: { id: user.id }
      }

      const response = new Response()
      await isAuthorized(request, response, next)

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })

  it('should not authenticate with token of wrong type', async () => {
    try {
      const userInfo = makeFakeUser()
      const user = await createAccount({ fullName: userInfo.fullName, email: userInfo.email, password: userInfo.password })

      const tokenInfo = makeToken({ user, type: 'PASSWORD' })
      const token = await tokensDb.insert({
        id: tokenInfo.getId(),
        userId: tokenInfo.getUserId(),
        accessToken: tokenInfo.getAccessToken(),
        type: tokenInfo.getType()
      })

      const request = {
        headers: {
          'Content-Type': 'application/json',
          'Authentication': `Bearer ${token.accessToken}`
        },
        path: `/api/users/${user.id}`,
        requestURL: `http://localhost:3000/api/users/${user.id}`,
        params: { id: user.id }
      }

      const response = new Response()
      await isAuthorized(request, response, next)
      expect(response.status()).toBe(401)
      expect(response.error().message).toBe('Wrong token.')

    } catch (e) {
      log.test({ msg: e })
      fail('It is not supposed to throw any error')
    }
  })

})